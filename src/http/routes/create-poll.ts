import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (response, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });
    const { title, options } = createPollBody.parse(response.body);

    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option };
            }),
          },
        },
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });

    return reply.status(201).send(poll);
  });
}
