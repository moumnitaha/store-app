"use client";
import { useEffect } from "react";
import { getServerSession } from "next-auth";

export default function Page() {
  return (
    <>
      <h1 className="w-full h-svh text-5xl font-extrabold flex justify-center items-center bg-stone-500">
        HOME
      </h1>
    </>
  );
}
