import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import {
	ClerkProvider,
	OrganizationSwitcher,
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
	title: "Homework Connect",
	description: "",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const { orgId } = await auth();

	return (
		<ClerkProvider>
			<html lang="en" className={`${geist.variable}`}>
				<body>
					<TRPCReactProvider>
						<header className="flex h-16 items-center justify-end gap-4 p-4">
							<SignedOut>
								<SignInButton />
								<SignUpButton />
							</SignedOut>
							<SignedIn>
								<div className="flex w-full items-center justify-between">
									<OrganizationSwitcher />
									<ul className="ml-5 flex grow gap-5">
										{orgId && (
											<>
												<Link href="/assignments">Assignments</Link>
												<Link href="/subjects">Subjects</Link>
												<Link href="/submissions">Submissions</Link>
											</>
										)}
									</ul>
									<UserButton />
								</div>
							</SignedIn>
						</header>
						{children}
					</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
