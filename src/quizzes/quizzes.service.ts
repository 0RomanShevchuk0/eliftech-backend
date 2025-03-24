import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, PrismaPromise, Quiz } from '@prisma/client';
import { getItemsToDelete, splitById } from 'src/utils/quiz.utils';
import { QuestionsService } from './questions/questions.service';
import { UpdateQuizQuestionDto } from './questions/dto/update-quiz-question.dto';
import { UpdateQuizOptionDto } from './questions/options/dto/update-quiz-option.dto';
import { getPaginationStatus, getSkipValue } from 'src/utils/pagination.utils';
import { WithPagination } from 'src/types/pagination.types';
import { getOrderBy } from 'src/utils/sorting.utils';
import { QUIZ_SORT_FIELDS } from 'src/constants/sort-fields';

@Injectable()
export class QuizService {
  constructor(
    private prismaService: PrismaService,
    private questionsService: QuestionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<WithPagination<Quiz>> {
    const skip = getSkipValue(page, limit);

    const orderBy = getOrderBy<Prisma.QuizOrderByWithRelationInput>(
      sortBy,
      QUIZ_SORT_FIELDS,
    );

    const [items, totalCount] = await Promise.all([
      this.prismaService.quiz.findMany({
        skip,
        take: limit,
        include: {
          questions: { orderBy: { order: 'asc' }, include: { options: true } },
          _count: true,
        },
        orderBy,
      }),
      this.prismaService.quiz.count(),
    ]);

    const { hasNextPage, hasPrevPage } = getPaginationStatus(
      page,
      limit,
      totalCount,
    );

    return {
      page,
      limit,
      totalCount,
      hasNextPage,
      hasPrevPage,
      items,
    };
  }

  async findOne(id: string) {
    const quiz = await this.prismaService.quiz.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' }, include: { options: true } },
        _count: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return quiz;
  }

  async create(createQuizDto: CreateQuizDto) {
    const response = await this.prismaService.quiz.create({
      data: {
        name: createQuizDto.name,
        description: createQuizDto.description,
        questions: {
          create: createQuizDto.questions.map((q) =>
            this.questionsService.toCreateQuestionObject(q),
          ),
        },
      },
      include: { questions: { include: { options: true } } },
    });
    return response;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    const existingQuestions = await this.prismaService.question.findMany({
      where: { quiz_id: id },
      select: { id: true },
    });

    const { newItems: newQuestions, existingItems: questionsToUpdate } =
      splitById<UpdateQuizQuestionDto>(updateQuizDto.questions);

    const questionIdsToDelete = getItemsToDelete<
      Partial<UpdateQuizQuestionDto>
    >(questionsToUpdate, existingQuestions);

    const transactionOperations: PrismaPromise<any>[] = [];

    if (newQuestions.length) {
      const createQuestionOperations = newQuestions.map((q) =>
        this.prismaService.question.create({
          data: {
            ...this.questionsService.toCreateQuestionObject(q),
            quiz_id: id,
          },
        }),
      );

      transactionOperations.push(...createQuestionOperations);
    }

    if (questionsToUpdate.length) {
      const questionsOptions = await this.prismaService.question.findMany({
        where: { id: { in: questionsToUpdate.map((q) => q.id!) } },
        select: { id: true, options: { select: { id: true } } },
      });

      const updateOperations = questionsToUpdate.map((question) => {
        const { newItems: optionsToCreate, existingItems: optionsToUpdate } =
          splitById(question.options ?? []);

        const existiongOptions =
          questionsOptions.find((q) => q.id === question.id)?.options || [];

        const optionIdsToDelete = getItemsToDelete<
          Partial<UpdateQuizOptionDto>
        >(optionsToUpdate, existiongOptions);

        return this.prismaService.question.update({
          where: { id: question.id },
          data: {
            title: question.title,
            order: question.order,
            type: question.type,
            options: {
              create: optionsToCreate,
              update: optionsToUpdate.map((o) => ({
                where: { id: o.id },
                data: o,
              })),
              deleteMany: { id: { in: optionIdsToDelete } },
            },
          },
        });
      });

      transactionOperations.push(...updateOperations);
    }

    if (questionIdsToDelete.length) {
      transactionOperations.push(
        this.prismaService.question.deleteMany({
          where: { id: { in: questionIdsToDelete } },
        }),
      );
    }

    transactionOperations.push(
      this.prismaService.quiz.update({
        where: { id },
        data: {
          name: updateQuizDto.name,
          description: updateQuizDto.description,
        },
        include: { questions: { include: { options: true } } },
      }),
    );

    const updatedQuiz = (
      await this.prismaService.$transaction(transactionOperations)
    ).at(-1);
    return updatedQuiz;
  }

  async remove(id: string) {
    return await this.prismaService.quiz.delete({ where: { id } });
  }
}
