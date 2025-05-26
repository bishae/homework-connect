"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Bell,
	ChevronUp,
	HelpCircle,
	LogOut,
	Moon,
	Settings,
	Sun,
	User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTheme } from "./theme-provider";

interface UserMenuProps {
	variant?: "sidebar" | "header";
}

export function UserMenu({ variant = "sidebar" }: UserMenuProps) {
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const [notificationCount, setNotificationCount] = useState(3);

	const handleThemeChange = (value: string) => {
		if (value === "system" || value === "light" || value === "dark") {
			setTheme(value);
		}
	};

	// Sample user data - in a real app, this would come from authentication
	const user = {
		name: "Ms. Johnson",
		email: "johnson@schooldistrict.edu",
		role: "Science Teacher",
		avatar: "/placeholder-user.jpg",
		initials: "MJ",
	};

	const handleLogout = () => {
		// In a real app, this would handle the logout process
		toast("Logging out", {
			description: "You have been successfully logged out.",
		});

		// Redirect to login page
		router.push("/login");
	};

	const clearNotifications = () => {
		setNotificationCount(0);
		toast("Notifications cleared", {
			description: "All notifications have been marked as read.",
		});
	};

	if (variant === "header") {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={user.avatar || "/placeholder.svg"}
								alt={user.name}
							/>
							<AvatarFallback>{user.initials}</AvatarFallback>
						</Avatar>
						{notificationCount > 0 && (
							<span className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-medium text-[10px] text-white">
								{notificationCount}
							</span>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="font-medium text-sm leading-none">{user.name}</p>
							<p className="text-muted-foreground text-xs leading-none">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href="/profile">
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/settings">
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						{notificationCount > 0 ? (
							<DropdownMenuItem onClick={clearNotifications}>
								<Bell className="mr-2 h-4 w-4" />
								<span>Notifications</span>
								<Badge variant="destructive" className="ml-auto text-xs">
									{notificationCount}
								</Badge>
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem disabled>
								<Bell className="mr-2 h-4 w-4" />
								<span>Notifications</span>
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{theme === "dark" ? (
								<Moon className="mr-2 h-4 w-4" />
							) : (
								<Sun className="mr-2 h-4 w-4" />
							)}
							<span>Theme</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup
									value={theme}
									onValueChange={handleThemeChange}
								>
									<DropdownMenuRadioItem value="light">
										<Sun className="mr-2 h-4 w-4" />
										Light
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="dark">
										<Moon className="mr-2 h-4 w-4" />
										Dark
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="system">
										System
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem asChild>
						<Link href="/help">
							<HelpCircle className="mr-2 h-4 w-4" />
							<span>Help & Support</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// Sidebar variant
	return (
		<div className="flex items-center space-x-3 border-t p-4">
			<Avatar>
				<AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
				<AvatarFallback>{user.initials}</AvatarFallback>
			</Avatar>
			<div className="min-w-0 flex-1 space-y-1">
				<p className="truncate font-medium text-sm leading-none">{user.name}</p>
				<p className="truncate text-muted-foreground text-xs">{user.role}</p>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="relative h-8 w-8">
						<ChevronUp className="h-4 w-4" />
						{notificationCount > 0 && (
							<span className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-medium text-[10px] text-white">
								{notificationCount}
							</span>
						)}
						<span className="sr-only">User menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="top" align="end" className="w-56">
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="font-medium text-sm leading-none">{user.name}</p>
							<p className="text-muted-foreground text-xs leading-none">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href="/profile">
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/settings">
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						{notificationCount > 0 ? (
							<DropdownMenuItem onClick={clearNotifications}>
								<Bell className="mr-2 h-4 w-4" />
								<span>Notifications</span>
								<Badge variant="destructive" className="ml-auto text-xs">
									{notificationCount}
								</Badge>
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem disabled>
								<Bell className="mr-2 h-4 w-4" />
								<span>Notifications</span>
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{theme === "dark" ? (
								<Moon className="mr-2 h-4 w-4" />
							) : (
								<Sun className="mr-2 h-4 w-4" />
							)}
							<span>Theme</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup
									value={theme}
									onValueChange={handleThemeChange}
								>
									<DropdownMenuRadioItem value="light">
										<Sun className="mr-2 h-4 w-4" />
										Light
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="dark">
										<Moon className="mr-2 h-4 w-4" />
										Dark
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="system">
										System
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem asChild>
						<Link href="/help">
							<HelpCircle className="mr-2 h-4 w-4" />
							<span>Help & Support</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
