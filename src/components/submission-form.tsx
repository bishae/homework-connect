"use client";

import { api } from "@/trpc/react";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";

export function SubmissionForm({ assignmentId }: { assignmentId: number }) {
	const { mutate } = api.submission.create.useMutation();

	const form = useForm({
		defaultValues: {
			assignmentId: assignmentId,
		},
		onSubmit: ({ value }) => {
			mutate(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Button type="submit">Submit</Button>
		</form>
	);
}
