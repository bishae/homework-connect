import { SubjectForm } from "@/components/subject-form";
import { SubjectsList } from "@/components/subjects-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Subjects() {
	const { orgId } = await auth();

	if (!orgId) return redirect("/");

	return (
		<main>
			<SubjectForm />
			<h1>Subjects</h1>
			<SubjectsList />
		</main>
	);
}
