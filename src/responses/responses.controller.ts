import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import {
  CreateResponseDto,
  createResponseSchema,
} from './dto/create-response.dto';
import { validateSchema } from 'src/utils/zod-validate';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  findAll() {
    return this.responsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateResponseDto) {
    const parsedData = validateSchema(createResponseSchema, body);
    return this.responsesService.create(parsedData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsesService.remove(id);
  }
}
