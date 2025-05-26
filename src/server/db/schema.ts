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

export const users = createTable(
	"users",
	(d) => ({
		id: d.serial("id").primaryKey(),
		firstName: d.varchar({ length: 256 }),
		lastName: d.varchar({ length: 256 }),
		imageUrl: d.varchar({ length: 256 }),
		email: d.varchar({ length: 256 }),
		phone: d.varchar({ length: 256 }),
		externalId: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [unique("user_external_id_idx").on(t.externalId)],
);

export const usersRelations = relations(users, ({ many }) => ({
	submissions: many(submissions),
	memberships: many(organizationMemberships),
}));

export const organizations = createTable(
	"organizations",
	(d) => ({
		id: d.serial("id").primaryKey(),
		name: d.varchar({ length: 256 }),
		slug: d.varchar({ length: 256 }),
		imageUrl: d.varchar({ length: 256 }),
		externalId: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		unique("organization_external_id_idx").on(t.externalId),
		unique("organization_slug_idx").on(t.slug),
	],
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
	organizationMemberships: many(organizationMemberships),
}));

export const organizationMemberships = createTable(
	"organization_memberships",
	(d) => ({
		id: d.serial("id").primaryKey(),
		userId: d.integer().references(() => users.id),
		organizationId: d.integer().references(() => organizations.id),
		role: d.varchar({ length: 256 }),
	}),
	(t) => [unique("user_organization_idx").on(t.userId, t.organizationId)],
);

export const organizationMembershipsRelations = relations(
	organizationMemberships,
	({ one }) => ({
		user: one(users, {
			fields: [organizationMemberships.userId],
			references: [users.id],
		}),
		organization: one(organizations, {
			fields: [organizationMemberships.organizationId],
			references: [organizations.id],
		}),
	}),
);
export const posts = createTable(
	"posts",
	(d) => ({
		id: d.serial("id").primaryKey(),
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
		id: d.serial("id").primaryKey(),
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
	studentSubjects: many(studentSubjects),
}));

export const studentSubjects = createTable(
	"student_subjects",
	(d) => ({
		id: d.serial("id").primaryKey(),
		studentId: d.integer().references(() => users.id),
		subjectId: d.integer().references(() => subjects.id),
	}),
	(t) => [unique().on(t.studentId, t.subjectId)],
);

export const studentSubjectsRelations = relations(
	studentSubjects,
	({ one }) => ({
		student: one(users, {
			fields: [studentSubjects.studentId],
			references: [users.id],
		}),
		subject: one(subjects, {
			fields: [studentSubjects.subjectId],
			references: [subjects.id],
		}),
	}),
);

export const assignments = createTable(
	"assignments",
	(d) => ({
		id: d.serial("id").primaryKey(),
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
		id: d.serial("id").primaryKey(),
		assignmentId: d.integer().references(() => assignments.id),
		studentId: d.integer().references(() => users.id),
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
	student: one(users, {
		fields: [submissions.studentId],
		references: [users.id],
	}),
}));
