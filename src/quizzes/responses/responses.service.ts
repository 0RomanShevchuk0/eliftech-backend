import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResponsesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(quizId: string) {
    return this.prismaService.response.findMany({
      where: { quiz_id: quizId },
      include: {
        answers: {
          select: {
            id: true,
            text: true,
            selected_options: true,
          },
        },
        quiz: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(quizId: string, id: string) {
    const response = await this.prismaService.response.findUnique({
      where: { quiz_id: quizId, id },
      include: {
        answers: {
          select: {
            id: true,
            text: true,
						question_id: true,
            selected_options: {select: {
							id: true,
							text: true,
							question_id: true
						}},
          },
        },
        quiz: { select: { id: true, name: true }, },
      },
    });

    if (!response) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return response;
  }

  async create(quizId: string, data: CreateResponseDto) {
    return this.prismaService.response.create({
      data: {
        quiz_id: quizId,
        submitted_at: data.submitted_at,
        completion_time: data.completion_time,
        answers: {
          create: data.answers.map((a) => {
						console.log('create a', a)
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
            id: true,
            text: true,
            selected_options: true,
          },
        },
        quiz: { select: { id: true, name: true } },
      },
    });
  }

  async remove(quizId: string, id: string) {
    return this.prismaService.response.delete({
      where: { quiz_id: quizId, id },
    });
  }
}
