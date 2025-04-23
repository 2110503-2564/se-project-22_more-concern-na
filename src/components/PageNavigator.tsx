"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { ArrowBigLeft } from "lucide-react";

interface PageNavigatorProps {
  page: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PageNavigator({ page, onPrev, onNext }: PageNavigatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        onClick={onPrev}
        className="p-0 hover:bg-transparent"
      >
        <Image
          src="/previous.png"
          alt="Previous"
          width={26}
          height={23}
        />
      </Button>
      <span className="text-white font-heading text-2xl">Page {page}</span>

      <Button
        variant="ghost"
        onClick={onNext}
        className="p-0 hover:bg-transparent"
      >
        <Image
          src="/next.png"
          alt="Next"
          width={26}
          height={23}
        />
      </Button>
    </div>
  );
}