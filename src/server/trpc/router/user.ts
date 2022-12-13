import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
export const userRouter = router({
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            like: true,
            status: {
              select: {
                id: true,
                text: true,
                image: true,
                like: {
                  select: {
                    id: true,
                    userId: true,
                  },
                },
                reply: true,
                user: true,
                createdAt: true,
              },
            },
            reply: true,
            coverImage: true,
            username: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string(),
        username: z.string(),
        image: z.string().nullable(),
        coverImage: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name: input.name,
            bio: input.bio,
            username: input.username,
            image: input.image,
            coverImage: input.coverImage,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
