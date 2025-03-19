import { Module } from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';

@Module({
  controllers: [QuizzesController],
  providers: [QuizService, PrismaService, QuestionsService],
})
export class QuizzesModule {}
