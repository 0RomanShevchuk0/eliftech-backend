import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaPromise } from '@prisma/client';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { UpdateQuestionDto } from 'src/question/dto/update-question.dto';

@Injectable()
export class QuizService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.quiz.findMany({
      include: { questions: true, _count: true },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.quiz.findUnique({
      where: { id },
      include: { questions: true, _count: true },
    });
  }

  async create(createQuizDto: CreateQuizDto) {
    const response = await this.prismaService.quiz.create({
      data: {
        name: createQuizDto.name,
        description: createQuizDto.description,
        questions: {
          createMany: { data: createQuizDto.questions },
        },
      },
      include: { questions: true, _count: true },
    });
    return response;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    const existingQuestions = await this.prismaService.question.findMany({
      where: { quiz_id: id },
      select: { id: true },
    });

    const { newQuestions, questionsToUpdate } = updateQuizDto.questions.reduce<{
      newQuestions: CreateQuestionDto[];
      questionsToUpdate: UpdateQuestionDto[];
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

    const transactionOperations: PrismaPromise<any>[] = [];

    if (newQuestions.length) {
      transactionOperations.push(
        this.prismaService.question.createMany({
          data: newQuestions.map((q) => q),
        }),
      );
    }

    if (questionsToUpdate.length) {
      transactionOperations.push(
        ...questionsToUpdate.map((q) =>
          this.prismaService.question.update({
            where: { id: q.id },
            data: { title: q.title, order: q.order },
          }),
        ),
      );
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
        include: { questions: true, _count: true },
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
