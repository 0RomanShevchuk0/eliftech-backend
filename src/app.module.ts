import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsService } from './questions/questions.service';
import { OptionsService } from './questions/options/options.service';

@Module({
  imports: [QuizzesModule],
  controllers: [AppController],
  providers: [AppService, QuestionsService, PrismaService, OptionsService],
})
export class AppModule {}
