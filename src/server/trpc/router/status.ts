import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const statusRouter = router({
  //public
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.status.findMany({
        select: {
          id: true,
          text: true,
          image: true,
          like: true,
          reply: true,
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.status.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            text: true,
            image: true,
            like: true,
            reply: true,
            user: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.status.findMany({
          where: {
            userId: input.userId,
          },
          select: {
            id: true,
            text: true,
            image: true,
            like: true,
            reply: true,
            user: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  //user only
  createStatus: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.status.create({
          data: {
            text: input.text,
            image: input.image,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.status.update({
          where: {
            id: input.id,
          },
          data: {
            text: input.text,
            image: input.image,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
