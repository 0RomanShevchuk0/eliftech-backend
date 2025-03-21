import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsService } from './quizzes/questions/questions.service';
import { ResponsesModule } from './quizzes/responses/responses.module';
import { AnswersService } from './quizzes/responses/answers/answers.service';

@Module({
  imports: [QuizzesModule, ResponsesModule],
  controllers: [AppController],
  providers: [AppService, QuestionsService, PrismaService, AnswersService],
})
export class AppModule {}
