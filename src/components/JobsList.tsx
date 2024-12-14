"use client";

import { JobType } from "@/app/utils/jobs";
import { jobs } from "@/app/utils/jobs";
import React, { useMemo } from "react";
import { SmallCard } from "./ui/SmallCard";

type JobsListProps = {
  search: string;
};

export default function JobsList({ search }: JobsListProps) {
  const { matchedJobs, otherJobs } = useMemo(() => {
    const lowerSearch = search.toLowerCase().trim();

    if (!lowerSearch) {
      return {
        matchedJobs: [],
        otherJobs: jobs,
      };
    }

    const exact: JobType[] = [];
    const partial: JobType[] = [];
    const others: JobType[] = [];

    jobs.forEach((job) => {
      const title = job.title.toLowerCase();

      if (title === lowerSearch) {
        exact.push(job);
      } else if (title.includes(lowerSearch)) {
        partial.push(job);
      } else {
        others.push(job);
      }
    });

    return {
      matchedJobs: [...exact, ...partial],
      otherJobs: others,
    };
  }, [search]);

  return (
    <div className="w-full max-w-6xl space-y-8">
      {!search.trim() ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full auto-rows-fr">
          {jobs.map((job: JobType) => (
            <SmallCard key={job.url} job={job} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {matchedJobs.length > 0 && (
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-lg font-semibold text-blue-700">
                  Resultados da pesquisa ({matchedJobs.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
                {matchedJobs.map((job: JobType) => (
                  <SmallCard key={`match-${job.url}`} job={job} />
                ))}
              </div>
            </div>
          )}

          {otherJobs.length > 0 && (
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h2 className="text-lg font-semibold text-gray-600">
                  Outras vagas ({otherJobs.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr opacity-75">
                {otherJobs.map((job: JobType) => (
                  <SmallCard key={`other-${job.url}`} job={job} />
                ))}
              </div>
            </div>
          )}

          {matchedJobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma vaga encontrada para "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
