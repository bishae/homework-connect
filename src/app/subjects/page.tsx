import { SubjectForm } from "@/components/subject-form";
import { SubjectsList } from "@/components/subjects-list";
import { api } from "@/trpc/server";

export default async function Subjects() {
	return (
		<main>
			<SubjectForm />
			<h1>Subjects</h1>
			<SubjectsList />
		</main>
	);
}
