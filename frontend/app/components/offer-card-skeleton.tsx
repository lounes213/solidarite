import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function OfferCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-4">
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </CardFooter>
    </Card>
  );
}