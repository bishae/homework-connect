"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function SubmissionsList() {
	const { data, isLoading, error } = api.submission.getAll.useQuery();

	if (isLoading) return <div className="p-4 text-center">Loading...</div>;

	if (error)
		return <div className="p-4 text-center text-red-500">{error.message}</div>;

	if (!data || data.length <= 0)
		return <div className="p-4 text-center">No submissions found</div>;

	return (
		<div className="rounded-md border">
			<Table>
				<TableCaption>List of student submissions</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[80px]">Student</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Assignment</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((entity) => (
						<TableRow key={entity.id}>
							<TableCell>
								<div className="relative h-10 w-10 overflow-hidden rounded-full">
									<Image
										src={entity.student?.imageUrl || ""}
										alt={entity.student?.firstName || ""}
										fill
										className="object-cover"
									/>
								</div>
							</TableCell>
							<TableCell className="font-medium">
								{entity.student?.firstName} {entity.student?.lastName}
							</TableCell>
							<TableCell>
								{entity.assignment?.name || "Unnamed Assignment"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
