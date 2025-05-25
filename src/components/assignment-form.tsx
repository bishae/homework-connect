"use client";

import { api } from "@/trpc/react";
import { useForm } from "@tanstack/react-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function AssignmentForm() {
	const utils = api.useUtils();
	const { mutate } = api.assignment.create.useMutation();

	const form = useForm({
		defaultValues: {
			name: "",
			subjectId: 0,
		},
		onSubmit: ({ value }) => {
			mutate(value);
			utils.assignment.getAll.invalidate();
			form.reset();
		},
	});

	const subjects = api.subject.getAll.useQuery();

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

			<form.Field name="subjectId">
				{(field) => (
					<Select
						value={field.state.value.toString()}
						onValueChange={(e) => field.handleChange(Number.parseInt(e))}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a subject" />
						</SelectTrigger>
						<SelectContent>
							{subjects.data?.map((subject) => (
								<SelectItem key={subject.id} value={subject.id.toString()}>
									{subject.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</form.Field>

			<Button type="submit">Save</Button>
		</form>
	);
}
