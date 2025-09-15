"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<HeroUIProvider>
			<NextThemesProvider attribute="class" defaultTheme="light">
				{children}
			</NextThemesProvider>
		</HeroUIProvider>
	);
}
