"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import UserPointEntry from "@/components/UserPointEntry";
import { UserPointEntryProps } from "@/components/UserPointEntry";

export default function AdminRedemptionPage() {
  const [pricePerPoint, setPricePerPoint] = useState("");
  const [userPoints, setUserPoints] = useState<UserPointEntryProps[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL;

  useEffect(() => {
    fetch(`${API_BASE}/api/redeemables/price-to-point`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPricePerPoint(String(data.priceToPoint));
        }
      });

    fetch(`${API_BASE}/api/admin/points`)
      .then((res) => res.json())
      .then((data) => {
        const formatted: UserPointEntryProps[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          point: String(item.point),
          handleSave: handleSaveUserPoint,
        }));
        setUserPoints(formatted);
      })
      .catch((err) => console.error("Error fetching user points:", err));
  }, [API_BASE]);

  const handleSaveUserPoint = (newPoint: number, id: string) => {
    console.log(`Callback after saved: ${newPoint} for user ${id}`);
  };

  const handleSavePrice = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/redeemables/price-to-point`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceToPoint: Number(pricePerPoint) }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Saved:", data.priceToPoint);
      } else {
        console.error("Failed to update");
      }
    } catch (err) {
      console.error("Error saving price per point:", err);
    }
  };

  return (
    <div className="min-h-screen px-10 py-8">
      <a
        href="/admin/dashboard"
        className="text-2x1 text-white underline mb-6 inline-block font-detail"
      >
        ← Back to Admin Dashboard
      </a>

      <section className="mb-14 w-full">
        <h1 className="text-5xl mb-6 font-heading text-white">
          Price To Point Rate
        </h1>
        <div className="w-full bg-bg-box px-6 py-6 border border-bg-border shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-2xl font-heading">
              Booking Price per Point
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                className="bg-white text-black font-detail rounded-md px-4 py-2 w-36 outline-none border border-bg-border"
                value={pricePerPoint}
                onChange={(e) => setPricePerPoint(e.target.value)}
              />
              <Button
                onClick={handleSavePrice}
                className="border border-gold-gd1 text-gold-gd1 hover:bg-gold-gd1 hover:text-black transition font-heading px-6 py-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <h1 className="text-5xl mb-6 font-heading text-white">
          Manage Redeem Points
        </h1>
        <div className="w-full bg-bg-box p-6 shadow-md border border-bg-border overflow-x-auto">
          <div className="grid grid-cols-3 text-white border-b border-white pb-2 mb-4 font-heading text-3x1 min-w-[600px]">
            <span>User</span>
            <span>Redeem Point</span>
            <span>Save Change</span>
          </div>
          {userPoints.map((user) => (
            <UserPointEntry key={user.id} {...user} />
          ))}
        </div>
      </section>
    </div>
  );
}