import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, createQuizSchema } from './dto/create-quiz.dto';
import { UpdateQuizDto, updateQuizSchema } from './dto/update-quiz.dto';
import { validateSchema } from 'src/utils/zod-validate';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateQuizDto) {
    const parsedData = validateSchema(createQuizSchema, body);
    return this.quizService.create(parsedData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateQuizDto) {
    const parsedData = validateSchema(updateQuizSchema, body);
    return this.quizService.update(id, parsedData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}
