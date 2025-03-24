import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { CreateQuizDto, createQuizSchema } from './dto/create-quiz.dto';
import { UpdateQuizDto, updateQuizSchema } from './dto/update-quiz.dto';
import { validateSchema } from 'src/utils/zod-validate';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.quizService.findAll(pageNumber, limitNumber, sortBy);
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
