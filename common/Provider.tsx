"use client"
import { useEffect } from "react";
import NextTopLoader from "nextjs-toploader";
import { ModalProvider } from "@/context/modal-context";
import { AppProvider } from "@/context/app-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApp } from "@/context/app-context";

// Dark mode sync component
const DarkModeSync = ({ children }: { children: React.ReactNode }) => {
    const { darkMode } = useApp();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const html = document.documentElement;
            if (darkMode) {
                html.classList.add("dark");
            } else {
                html.classList.remove("dark");
            }
        }
    }, [darkMode]);

    return <>{children}</>;
};

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 0,
                refetchOnReconnect: false,
            },
        },
    });
    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <DarkModeSync>
                    <ModalProvider>
                        <NextTopLoader showSpinner={false} color="#0CAF60" />
                        {children}
                    </ModalProvider>
                </DarkModeSync>
            </AppProvider>
        </QueryClientProvider>
    )
}