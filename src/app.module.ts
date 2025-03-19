import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';
import { QuestionService } from './question/question.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [QuizModule],
  controllers: [AppController],
  providers: [AppService, QuestionService, PrismaService],
})
export class AppModule {}
