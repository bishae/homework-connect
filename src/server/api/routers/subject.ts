import { subjects } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const subjectRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.auth.orgId;
		if (!orgId)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You must be in an organization to access this resource.",
			});

		return await ctx.db.query.subjects.findMany({
			where: (subject, { eq }) => eq(subject.owner, orgId),
		});
	}),
	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const entity = await ctx.db
				.insert(subjects)
				.values({
					name: input.name,
					owner: ctx.auth.orgId,
				})
				.returning();

			return entity[0];
		}),
});
