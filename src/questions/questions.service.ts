import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {
  constructor(private prismaService: PrismaService) {}

  async findQuizQuestions(id: string) {
    return this.prismaService.question.findMany({ where: { quiz_id: id } });
  }
}
