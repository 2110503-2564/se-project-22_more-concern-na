"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface UserPointEntryProps {
  id: string;
  name: string;
  email: string;
  point: string;
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

  const handleClick = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL;

    try {
      const response = await fetch(`${API_BASE}/api/admin/points/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ point: parseInt(localPoint) }),
      });

      if (!response.ok) {
        throw new Error("Failed to update point");
      }

      console.log(`Updated point for user ${id} to ${localPoint}`);
      handleSave(parseInt(localPoint), id);
    } catch (error) {
      console.error("Error updating user point:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 items-center gap-4 mb-4 font-detail">
      <div>
        <p className="text-x1 font-detail text-white">{name}</p>
        <p className="text-x1 font-detail text-white">{email}</p>
      </div>
      <input
        type="number"
        className="bg-white text-black font-detail rounded-2xl px-3 py-2 w-36 outline-none border border-bg-border"
        value={localPoint}
        onChange={(e) => setLocalPoint(e.target.value)}
      />
      <Button
        onClick={handleClick}
        className="border border-gold-gd1 text-gold-gd1 hover:bg-gold-gd1 hover:text-black transition w-fit px-7 py-4"
      >
        Save
      </Button>
    </div>
  );
}