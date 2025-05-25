"use client";

import { api } from "@/trpc/react";

export function SubjectsList() {
	const { data, isLoading, error } = api.subject.getAll.useQuery();

	if (isLoading) return <div>Loading...</div>;

	if (error) return <div>{error.message}</div>;

	if (!data || data.length <= 0) return <div>No data</div>;

	return (
		<div>
			{data.map((subject) => (
				<div key={subject.id}>{subject.name}</div>
			))}
		</div>
	);
}
