import { auth } from "@clerk/nextjs/server";

export default async function Home() {
	const { orgRole, orgSlug } = await auth();

	if (orgRole === "org:admin") return <p>Dashboard</p>;

	return <p>Home - {orgSlug}</p>;
}
