import * as React from "react";
import { Button } from "./ui/button";

export function OfferDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-9 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image placeholder */}
        <div className="h-80 bg-gray-200"></div>
        
        {/* Offer details */}
        <div className="p-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-7 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          <div className="border-t border-b py-4 my-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/5"></div>
              </div>
            </div>
            
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mt-1"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="text-center mt-4">
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}