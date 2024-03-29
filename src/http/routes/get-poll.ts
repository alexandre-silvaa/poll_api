import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (response, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });
    const { pollId } = getPollParams.parse(response.params);

    const poll = await prisma.poll.findUniqueOrThrow({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return reply.send(poll);
  });
}
