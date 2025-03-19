import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prismaService: PrismaService) {}

  toCreateQuestionObject(question: CreateQuizQuestionDto) {
    const questionOptions = question.options && {
      create: question.options.map((option) => ({
        text: option.text,
      })),
    };

    return {
      title: question.title,
      type: question.type,
      order: question.order,
      options: questionOptions,
    };
  }
}
