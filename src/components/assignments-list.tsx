"use client";

import { api } from "@/trpc/react";
import Link from "next/link";

export function AssignmentsList() {
	const { data, isLoading, error } = api.assignment.getAll.useQuery();

	if (isLoading) return <div>Loading...</div>;

	if (error) return <div>{error.message}</div>;

	if (!data || data.length <= 0) return <div>No data</div>;

	return (
		<div>
			{data.map((assignment) => (
				<Link key={assignment.id} href={`/assignments/${assignment.id}`}>
					{assignment.name} - {assignment.subject?.name}
				</Link>
			))}
		</div>
	);
}
