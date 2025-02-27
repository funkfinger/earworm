"use client";

import React from "react";
import ErrorBoundaryExample from "@/app/components/ErrorBoundaryExample";
import Link from "next/link";

export default function ErrorBoundaryExamplePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          ErrorBoundary Component Examples
        </h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates different ways to use the ErrorBoundary
          component to handle errors in your React application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ErrorBoundaryExample />
      </div>
    </div>
  );
}
