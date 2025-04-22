"use client";
import React from "react";
import RefreshStatus from "@/components/RefreshStatus/RefreshStatus";

export default function RefreshPage() {
  const handleRefresh = async (batchSize: number = 100, userId?: string) => {
    try {
      const queryParams = new URLSearchParams();

      if (batchSize) {
        queryParams.append("batchSize", batchSize.toString());
      }

      if (userId) {
        queryParams.append("userId", userId);
      }

      const response = await fetch(`/api/refresh?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start refresh process");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error triggering refresh:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <RefreshStatus onRefresh={handleRefresh} />
    </div>
  );
}
