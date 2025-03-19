import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { QuizModule } from './quizzes/quizzes.module';
import { QuestionService } from './questions/questions.service';
import { OptionsService } from './questions/options/options.service';

@Module({
  imports: [QuizModule],
  controllers: [AppController],
  providers: [AppService, QuestionService, PrismaService, OptionsService],
})
export class AppModule {}
