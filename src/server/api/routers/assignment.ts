import { assignments } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const assignmentRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.auth.orgId;
		if (!orgId)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be in an organization to access this resource.",
			});

		return await ctx.db.query.assignments.findMany({
			with: {
				subject: true,
			},
			where: (assignment, { eq }) => eq(assignment.owner, orgId),
		});
	}),
	getById: protectedProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const entity = await ctx.db.query.assignments.findFirst({
				with: {
					subject: true,
				},
				where: (assignment, { eq }) => eq(assignment.id, input.id),
			});
			return entity;
		}),
	create: protectedProcedure
		.input(z.object({ name: z.string().min(1), subjectId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const orgId = ctx.auth.orgId;

			if (!orgId)
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You must be in an organization to access this resource.",
				});

			const entity = await ctx.db
				.insert(assignments)
				.values({
					name: input.name,
					subjectId: input.subjectId,
					owner: orgId,
				})
				.returning();

			return entity[0];
		}),
});
