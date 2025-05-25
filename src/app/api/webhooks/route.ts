import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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

		return new Response("Webhook received", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
}
