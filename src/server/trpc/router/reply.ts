import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const replyRouter = router({
  //public
  getAll: publicProcedure
    .input(
      z.object({
        statusId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reply.findMany({
          where: {
            statusId: input.statusId,
          },
          select: {
            id: true,
            text: true,
            user: true,
            createdAt: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  createReply: protectedProcedure
    .input(
      z.object({
        statusId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.reply.create({
          data: {
            text: input.text,
            statusId: input.statusId,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteReply: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reply.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
