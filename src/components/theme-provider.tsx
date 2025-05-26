"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextProps {
	theme: "light" | "dark" | "system";
	setTheme: (theme: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextProps>({
	theme: "system",
	setTheme: () => {},
});

export const ThemeProvider = ({
	children,
	defaultTheme = "system",
	storageKey = "homework-connect-theme",
}: {
	children: React.ReactNode;
	defaultTheme?: "light" | "dark" | "system";
	storageKey?: string;
}) => {
	const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
		if (typeof window === "undefined") {
			return defaultTheme;
		}
		try {
			const storedTheme = localStorage.getItem(storageKey) as
				| "light"
				| "dark"
				| "system"
				| null;
			return storedTheme || defaultTheme;
		} catch (e) {
			return defaultTheme;
		}
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem(storageKey, theme);
		}
	}, [theme, storageKey]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
