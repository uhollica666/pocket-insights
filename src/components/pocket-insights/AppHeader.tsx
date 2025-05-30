"use client";

import { PiggyBank } from "lucide-react";

export function AppHeader() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center space-x-3 max-w-3xl px-4">
        <PiggyBank className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Pocket Insights
        </h1>
      </div>
    </header>
  );
}
