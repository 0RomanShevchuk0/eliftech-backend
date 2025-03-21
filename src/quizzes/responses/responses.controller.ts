import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import {
  CreateResponseDto,
  createResponseSchema,
} from './dto/create-response.dto';
import { validateSchema } from 'src/utils/zod-validate';

@Controller('quizzes/:quizId/responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  findAll(@Param('quizId') quizId: string) {
    return this.responsesService.findAll(quizId);
  }

  @Get(':id')
  findOne(@Param('quizId') quizId: string, @Param('id') id: string) {
    return this.responsesService.findOne(quizId, id);
  }

  @Post()
  create(@Param('quizId') quizId: string, @Body() body: CreateResponseDto) {
    const parsedData = validateSchema(createResponseSchema, body);
    return this.responsesService.create(quizId, parsedData);
  }

  @Delete(':id')
  remove(@Param('quizId') quizId: string, @Param('id') id: string) {
    return this.responsesService.remove(quizId, id);
  }
}
