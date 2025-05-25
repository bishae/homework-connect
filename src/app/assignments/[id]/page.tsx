import { SubmissionForm } from "@/components/submission-form";
import { api } from "@/trpc/server";

export default async function Assignment({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const data = await api.assignment.getById({ id: Number(id) });

	return (
		<>
			<div>Assignment: {data?.name}</div>
			<SubmissionForm assignmentId={Number(id)} />
		</>
	);
}
