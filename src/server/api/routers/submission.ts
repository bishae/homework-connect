import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { submissions } from "@/server/db/schema";
import { db } from "@/server/db";

export const submissionRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.externalId, ctx.auth.userId),
		});

		if (!user)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be signed in to access this resource.",
			});

		return await ctx.db.query.submissions.findMany({
			with: {
				assignment: true,
				student: true,
			},
			where: (submissions, { eq }) => eq(submissions.studentId, user.id),
		});
	}),
	create: protectedProcedure
		.input(z.object({ assignmentId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.externalId, ctx.auth.userId),
			});

			if (!user)
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be signed in to access this resource.",
				});

			const entity = await ctx.db
				.insert(submissions)
				.values({
					assignmentId: input.assignmentId,
					studentId: user.id,
				})
				.returning();

			return entity[0];
		}),
});
