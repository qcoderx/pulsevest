// pulsevest/components/creator/InvestorDirectory.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

interface Investor {
  name: string;
  contactInfo: string;
  investmentInterests: string;
}

export function InvestorDirectory() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestors() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/investors");
        const data = await response.json();
        if (data.investors) {
          setInvestors(data.investors);
        }
      } catch (error) {
        console.error("Failed to fetch investors:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInvestors();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
        <p className="mt-4 text-muted">Loading Investor Network...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-satoshi text-3xl font-bold">Investor Network</h2>
        <p className="text-muted mt-1">
          Connect with investors who are actively looking for the next big
          thing.
        </p>
      </div>
      {investors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{investor.name}</CardTitle>
                <CardDescription className="text-primary font-semibold !mt-2">
                  {investor.contactInfo}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-bold mb-2">
                  Looking to invest in:
                </h4>
                <p className="text-sm text-muted">
                  {investor.investmentInterests}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-10">
          No investors have joined the network yet.
        </p>
      )}
    </div>
  );
}
