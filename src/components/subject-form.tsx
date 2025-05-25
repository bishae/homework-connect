"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";

export function SubjectForm() {
	const { mutate } = api.subject.create.useMutation();
	const utils = api.useUtils();

	const form = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: ({ value }) => {
			mutate(value);
			utils.subject.getAll.invalidate();
			form.reset();
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
			<form.Field name="name">
				{(field) => (
					<Input
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
				)}
			</form.Field>

			<Button type="submit">Save</Button>
		</form>
	);
}
