"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BookOpen,
	Calendar,
	Home,
	MessageSquare,
	Settings,
	Users,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";

export function AppSidebar() {
	const pathname = usePathname();

	const navItems = [
		{
			title: "Dashboard",
			href: "/",
			icon: Home,
		},
		{
			title: "Classes",
			href: "/classes",
			icon: Users,
		},
		{
			title: "Assignments",
			href: "/assignments",
			icon: BookOpen,
		},
		{
			title: "Settings",
			href: "/settings",
			icon: Settings,
		},
	];

	return (
		<Sidebar>
			<SidebarHeader className="flex flex-col items-center justify-center border-b p-4">
				<div className="flex items-center space-x-2">
					<BookOpen className="h-6 w-6 text-primary" />
					<h1 className="font-bold text-lg">Homework Connect</h1>
				</div>
				<div className="mt-4 hidden w-full md:block">
					<SidebarTrigger className="absolute top-2 right-2 md:hidden" />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{navItems.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton
								asChild
								isActive={pathname === item.href}
								tooltip={item.title}
							>
								<Link href={item.href} className="flex items-center">
									<item.icon className="mr-2 h-5 w-5" />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="p-0">
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
