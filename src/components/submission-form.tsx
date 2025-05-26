"use client";

import { api } from "@/trpc/react";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";

export function SubmissionForm({ assignmentId }: { assignmentId: number }) {
	const utils = api.useUtils();
	const { data, isLoading, error } = api.submission.hasSubmitted.useQuery({
		assignmentId,
	});
	const { mutate } = api.submission.create.useMutation();

	const form = useForm({
		defaultValues: {
			assignmentId: assignmentId,
		},
		onSubmit: ({ value }) => {
			mutate(value);
			utils.submission.hasSubmitted.invalidate({
				assignmentId: value.assignmentId,
			});
		},
	});

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>Error: {error.message}</p>;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Button type="submit" disabled={data}>
				{data ? "Submitted" : "Submit"}
			</Button>
		</form>
	);
}
