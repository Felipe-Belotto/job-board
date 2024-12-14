"use client";

import JobsList from "@/components/JobsList";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HomeContainer() {
  const [search, setSearch] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <header className="w-full max-w-6xl flex  items-center justify-between">
        <h1 className="text-3xl font-bold mb-8">Trabalhe conosco</h1>
        <div>
          <Input
            placeholder="Pesquise por uma vaga"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <JobsList search={search} />
    </main>
  );
}
