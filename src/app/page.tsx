'use client'
import NewsPage from "@/Components/NewsPage";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col items-center w-[90%]">
        <NewsPage/>
      </div>
    </div>
  );
}
