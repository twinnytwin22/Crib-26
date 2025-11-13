"use client";
import * as React from "react";

import { AuthContextProvider } from "@/app/context/auth";
import InvoiceContextProvider from "@/app/context/invoice";
import SiteContextProvider from "@/app/context/siteContext";
import { EditorContextProvider } from "@/ui/Email/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { Suspense } from "react";
const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SiteContextProvider>
          <Suspense>
            <ThemeProvider
              enableSystem={true}
              attribute="class"
              defaultTheme="dark"
              // disableTransitionOnChange
            >
              <InvoiceContextProvider>
                <EditorContextProvider>{children}</EditorContextProvider>
              </InvoiceContextProvider>
            </ThemeProvider>
          </Suspense>
        </SiteContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
