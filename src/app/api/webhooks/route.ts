import { db } from "@/server/db";
import {
	organizationMemberships,
	organizations,
	users,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const evt = await verifyWebhook(req);

		// Do something with payload
		// For this guide, log payload to console
		const { id } = evt.data;
		const eventType = evt.type;
		// console.log(
		// 	`Received webhook with ID ${id} and event type of ${eventType}`,
		// );
		// console.log("Webhook payload:", evt.data);

		if (evt.type === "user.created") {
			console.log("user:", evt.data);
			await db.insert(users).values({
				firstName: evt.data.first_name,
				lastName: evt.data.last_name,
				imageUrl: evt.data.image_url,
				email: evt.data.email_addresses[0]?.email_address,
				phone: evt.data.phone_numbers[0]?.phone_number,
				externalId: evt.data.id,
			});
		}

		if (evt.type === "user.updated" && evt.data.id) {
			console.log("user:", evt.data);
			await db
				.update(users)
				.set({
					firstName: evt.data.first_name,
					lastName: evt.data.last_name,
					imageUrl: evt.data.image_url,
					email: evt.data.email_addresses[0]?.email_address,
					phone: evt.data.phone_numbers[0]?.phone_number,
				})
				.where(eq(users.externalId, evt.data.id));
		}

		if (evt.type === "user.deleted" && evt.data.id) {
			console.log("user:", evt.data.id);
			await db.delete(users).where(eq(users.externalId, evt.data.id));
		}

		if (evt.type === "organization.created" && evt.data.id) {
			console.log("organization:", evt.data.id);
			await db.insert(organizations).values({
				name: evt.data.name,
				slug: evt.data.slug,
				imageUrl: evt.data.image_url,
				externalId: evt.data.id,
			});
		}

		if (evt.type === "organization.updated" && evt.data.id) {
			console.log("organization:", evt.data.id);
			await db
				.update(organizations)
				.set({
					name: evt.data.name,
					slug: evt.data.slug,
					imageUrl: evt.data.image_url,
				})
				.where(eq(organizations.externalId, evt.data.id));
		}

		if (evt.type === "organization.deleted" && evt.data.id) {
			console.log("organization:", evt.data.id);
			await db
				.delete(organizations)
				.where(eq(organizations.externalId, evt.data.id));
		}

		if (evt.type === "organizationMembership.created") {
			console.log("organizationMembership:", evt.data.id);

			const user = await db.query.users.findFirst({
				where: eq(users.externalId, evt.data.public_user_data.user_id),
			});

			if (!user) {
				console.error("User not found:", evt.data.public_user_data.user_id);
				return new Response("User not found", { status: 404 });
			}

			const organization = await db.query.organizations.findFirst({
				where: eq(organizations.externalId, evt.data.organization.id),
			});

			if (!organization) {
				console.error("Organization not found:", evt.data.organization.id);
				return new Response("Organization not found", { status: 404 });
			}

			const userOrganization = await db.query.organizationMemberships.findFirst(
				{
					where: and(
						eq(organizationMemberships.userId, user.id),
						eq(organizationMemberships.organizationId, organization.id),
					),
				},
			);

			if (userOrganization) {
				console.log("User already in organization:", user.id, organization.id);
				return new Response("User already in organization", { status: 200 });
			}

			await db.insert(organizationMemberships).values({
				userId: user.id,
				organizationId: organization.id,
				role: evt.data.role,
			});
		}

		if (evt.type === "organizationMembership.updated") {
			console.log("organizationMembership:", evt.data.id);

			const user = await db.query.users.findFirst({
				where: eq(users.externalId, evt.data.public_user_data.user_id),
			});

			if (!user) {
				console.error("User not found:", evt.data.public_user_data.user_id);
				return new Response("User not found", { status: 404 });
			}

			const organization = await db.query.organizations.findFirst({
				where: eq(organizations.externalId, evt.data.organization.id),
			});

			if (!organization) {
				console.error("Organization not found:", evt.data.organization.id);
				return new Response("Organization not found", { status: 404 });
			}

			await db
				.update(organizationMemberships)
				.set({
					role: evt.data.role,
				})
				.where(
					and(
						eq(organizationMemberships.userId, user.id),
						eq(organizationMemberships.organizationId, organization.id),
					),
				);
		}

		if (evt.type === "organizationMembership.deleted") {
			console.log("organizationMembership:", evt.data.id);

			const user = await db.query.users.findFirst({
				where: eq(users.externalId, evt.data.public_user_data.user_id),
			});

			if (!user) {
				console.error("User not found:", evt.data.public_user_data.user_id);
				return new Response("User not found", { status: 404 });
			}

			const organization = await db.query.organizations.findFirst({
				where: eq(organizations.externalId, evt.data.organization.id),
			});

			if (!organization) {
				console.error("Organization not found:", evt.data.organization.id);
				return new Response("Organization not found", { status: 404 });
			}

			await db
				.delete(organizationMemberships)
				.where(
					and(
						eq(organizationMemberships.userId, user.id),
						eq(organizationMemberships.organizationId, organization.id),
					),
				);
		}

		return new Response("Webhook received", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
}
