import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResponsesService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.response.findMany({
      include: {
        answers: {
          select: {
            selected_options: { select: { text: true } },
          },
        },
        quiz: { select: { id: true, name: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.response.findUnique({
      where: { id },
      include: { answers: true, quiz: { select: { id: true, name: true } } },
    });
  }

  create(data: CreateResponseDto) {
    return this.prismaService.response.create({
      data: {
        quiz_id: data.quiz_id,
        submitted_at: data.submitted_at,
        completion_time: data.completion_time,
        answers: {
          create: data.answers.map((a) => {
            return {
              text: a.text,
              question_id: a.question_id,
              selected_options: {
                connect: a.selected_options.map((optionId) => ({
                  id: optionId,
                })),
              },
            };
          }),
        },
      },
      include: {
        answers: {
          select: {
            selected_options: { select: { text: true } },
          },
        },
        quiz: { select: { id: true, name: true } },
      },
    });
  }

  remove(id: string) {
    return this.prismaService.response.delete({ where: { id } });
  }
}
