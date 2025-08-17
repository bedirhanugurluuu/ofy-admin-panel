// components/common/LoadingSpinner.tsx
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="loading loading-spinner loading-md text-primary"></div>
    </div>
  );
}
