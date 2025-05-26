import { SubmissionForm } from "@/components/submission-form";
import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Assignment({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const data = await api.assignment.getById({ id: Number(id) });

	const { orgId } = await auth();

	if (!orgId) return redirect("/");

	return (
		<>
			<div>Assignment: {data?.name}</div>
			<SubmissionForm assignmentId={Number(id)} />
		</>
	);
}
