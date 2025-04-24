"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface UserPointEntryProps {
  id: string;
  name: string;
  email: string;
  point: number;
  handleSave: (newPoint: number, id: string) => void;
}

export default function UserPointEntry({
  id,
  name,
  email,
  point,
  handleSave,
}: UserPointEntryProps) {
  const [localPoint, setLocalPoint] = useState(point);

  return (
    <div className="grid grid-cols-3 items-center gap-4 mb-4 font-detail">
      <div>
        <p className="font-detail text-white">{name}</p>
        <p className="text-sm font-detail text-gray-400">{email}</p>
      </div>
      <input
        type="number"
        className="bg-white text-black font-detail rounded-2xl px-3 py-2 w-36 outline-none border border-bg-border"
        value={localPoint}
        onChange={(e) => setLocalPoint(e.target.valueAsNumber)}
      />
      <Button
        onClick={() => handleSave(localPoint, id)}
        className="border border-gold-gd1 text-gold-gd1 hover:bg-gold-gd1 hover:text-black transition w-fit px-7 py-4"
      >
        Save
      </Button>
    </div>
  );
}