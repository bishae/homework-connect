// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, unique } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const posts = createTable(
	"posts",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		owner: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("post_name_idx").on(t.name)],
);

export const subjects = createTable(
	"subjects",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		owner: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("subject_name_idx").on(t.name)],
);

export const subjectsRelations = relations(subjects, ({ many }) => ({
	assignments: many(assignments),
}));

export const assignments = createTable(
	"assignments",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		subjectId: d.integer().references(() => subjects.id),
		owner: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("assignment_name_idx").on(t.name)],
);

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
	subject: one(subjects, {
		fields: [assignments.subjectId],
		references: [subjects.id],
	}),
	submissions: many(submissions),
}));

export const submissions = createTable(
	"submissions",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		assignmentId: d.integer().references(() => assignments.id),
		studentId: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [unique().on(t.assignmentId, t.studentId)],
);

export const submissionsRelations = relations(submissions, ({ one }) => ({
	assignment: one(assignments, {
		fields: [submissions.assignmentId],
		references: [assignments.id],
	}),
}));
