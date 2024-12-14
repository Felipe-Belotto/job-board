"use client";

import React, { createContext, useContext, useState } from "react";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { JobType } from "@/app/utils/jobs";

// Contexto para gerenciar URLs com erro
const UrlErrorContext = createContext<{
  urlsWithError: Set<string>;
  addErrorUrl: (url: string) => void;
}>({
  urlsWithError: new Set(),
  addErrorUrl: () => {},
});

const getFaviconUrl = (url: string) => {
  try {
    const urlObject = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`;
  } catch {
    return "";
  }
};

export const SmallCard = ({ job }: { job: JobType }) => {
  const [hasError, setHasError] = useState(false);
  const { addErrorUrl } = useContext(UrlErrorContext);

  const handleError = () => {
    setHasError(true);
    addErrorUrl(job.url);
  };

  return (
    <Link
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline group"
    >
      <Card className="transition-all duration-300 hover:scale-105">
        <div className="p-3 flex flex-col items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
            {hasError ? (
              <Building2 className="w-5 h-5 text-gray-400" />
            ) : (
              <img
                src={getFaviconUrl(job.url)}
                alt={`${job.title} logo`}
                className="w-6 h-6 object-contain"
                onError={handleError}
              />
            )}
          </div>
          <p className="text-xs text-center font-medium text-gray-600 line-clamp-2 group-hover:text-blue-600">
            {job.title}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export const JobsList = ({
  jobs,
  search,
}: {
  jobs: JobType[];
  search: string;
}) => {
  const [urlsWithError, setUrlsWithError] = useState<Set<string>>(new Set());
  const [showErrorJobs, setShowErrorJobs] = useState(false);

  const addErrorUrl = (url: string) => {
    setUrlsWithError((prev) => new Set(prev).add(url));
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (!urlsWithError.has(job.url) || showErrorJobs)
  );

  const errorJobs = jobs.filter((job) => urlsWithError.has(job.url));

  return (
    <UrlErrorContext.Provider value={{ urlsWithError, addErrorUrl }}>
      <div className="w-full space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredJobs.map((job, index) => (
            <SmallCard key={index} job={job} />
          ))}
        </div>

        {errorJobs.length > 0 && (
          <div className="space-y-4">
            <button
              onClick={() => setShowErrorJobs(!showErrorJobs)}
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              {showErrorJobs ? "Ocultar" : "Mostrar"} vagas sem favicon (
              {errorJobs.length})
            </button>

            {showErrorJobs && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-60">
                {errorJobs.map((job, index) => (
                  <SmallCard key={`error-${index}`} job={job} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </UrlErrorContext.Provider>
  );
};
