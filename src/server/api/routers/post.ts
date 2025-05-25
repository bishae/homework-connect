import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(posts).values({
				name: input.name,
				owner: ctx.auth.userId,
			});
		}),

	getLatest: publicProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.query.posts.findFirst({
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		});

		return post ?? null;
	}),
	getPosts: publicProcedure.query(async ({ ctx }) => {
		const userId = ctx.auth.userId;

		if (!userId) {
			return new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be signed in to access this resource.",
			});
		}

		const posts = await ctx.db.query.posts.findMany({
			where: (posts, { eq }) => eq(posts.owner, userId),
		});

		return posts;
	}),
});
