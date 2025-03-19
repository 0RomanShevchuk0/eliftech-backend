import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaPromise } from '@prisma/client';
import { UpdateQuizQuestionDto } from 'src/questions/dto/update-quiz-question.dto';
import { QuestionsService } from 'src/questions/questions.service';

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

    const { newQuestions, questionsToUpdate } = updateQuizDto.questions.reduce<{
      newQuestions: UpdateQuizQuestionDto[];
      questionsToUpdate: UpdateQuizQuestionDto[];
    }>(
      (acc, q) => {
        if (q.id) {
          acc.questionsToUpdate.push(q);
        } else {
          acc.newQuestions.push(q);
        }
        return acc;
      },
      { newQuestions: [], questionsToUpdate: [] },
    );

    const newQuestionsIds = new Set(questionsToUpdate.map((q) => q.id));
    const idsToDelete = existingQuestions
      .filter((q) => !newQuestionsIds.has(q.id))
      .map((q) => q.id);

    console.log(' QuizServiceupdate newQuestions:', newQuestions);
    console.log(' QuizServiceupdate questionsToUpdate:', questionsToUpdate);
    console.log(' QuizServiceupdate idsToDelete:', idsToDelete);

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
      const updateOperations = questionsToUpdate.map((q) => {
        const newOptions = q.options?.map((option) => ({
          text: option.text,
        }));
        const optionsToUpdate = q.options?.map((option) => ({
          text: option.text,
        }));

        const optionsToDelete = [];

        return this.prismaService.question.update({
          where: { id: q.id },
          data: {
            title: q.title,
            order: q.order,
            type: q.type,
            options: {
              create: newOptions,
              update: [],
              deleteMany: [],
            },
          },
        });
      });

      transactionOperations.push(...updateOperations);
    }

    if (idsToDelete.length) {
      transactionOperations.push(
        this.prismaService.question.deleteMany({
          where: { id: { in: idsToDelete } },
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
