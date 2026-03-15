import React from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-(--bg) text-center px-6">
      
      <img
        src="/Monster404.png"
        alt="404 not found"
        className="w-96 max-w-full mb-8"
      />

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-lg bg-(--violet) text-white hover:bg-(--violet-light) transition"
        >
          Go Home
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-lg border border-(--border-strong) hover:bg-(--bg-subtle) transition"
        >
          Go Back to Instance
        </button>
      </div>
    </div>
  );
};