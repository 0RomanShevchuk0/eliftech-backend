import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaPromise } from '@prisma/client';
import { UpdateQuizQuestionDto } from 'src/questions/dto/update-quiz-question.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { UpdateQuizOptionDto } from 'src/questions/options/dto/update-quiz-option.dto';
import { getItemsToDelete, splitById } from 'src/utils/quiz.utils';

@Injectable()
export class QuizService {
  constructor(
    private prismaService: PrismaService,
    private questionsService: QuestionsService,
  ) {}

  async findAll() {
    return await this.prismaService.quiz.findMany({
      include: { questions: { include: { options: true } }, _count: true },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } }, _count: true },
    });
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
    // return await this.prismaService.quiz.delete({ where: { id } });
    return await this.prismaService.quiz.deleteMany();
  }
}
