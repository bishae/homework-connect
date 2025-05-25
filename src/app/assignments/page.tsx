import { AssignmentForm } from "@/components/assignment-form";
import { AssignmentsList } from "@/components/assignments-list";

export default function Assignments() {
	return (
		<main>
			<AssignmentForm />
			<h1>Assignments</h1>
			<AssignmentsList />
		</main>
	);
}
