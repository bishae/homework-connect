import { assignments } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const assignmentRouter = createTRPCRouter({
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
					owner: orgId,
				})
				.returning();

			return entity[0];
		}),
});
