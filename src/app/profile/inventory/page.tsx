'use client'
import Loader from "@/components/Loader";
import StatCard from "@/components/StatCard";
import { Gift, Ticket } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function inventory() {
    const router = useRouter();
    const [couponCount, setCouponCount] = useState<number>(4);
    const [giftCount, setGiftCount] = useState<number>(0);

    const handleClick = () => {
        //router.push('/reward/redeemables');
        router.push('/');
    };
    
    return (
        <div className="container mx-auto p-4">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-white text-3xl font-heading">Your Inventory</h1>
                        <Button 
                            variant="golden"
                            onClick={handleClick}
                            className="rounded-sm flex items-center justify-center font-detail"
                            data-testid='redeemMore'
                        >
                            Redeem more
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard 
                            icon={<Ticket size={28} className="text-white" />}
                            title="Coupon"
                            count={couponCount}
                            countLabel="Total available coupons"
                            hideButton={true}
                        />
                        
                        <StatCard 
                            icon={<Gift size={28} className="text-white" />}
                            title="Gift"
                            count={giftCount}
                            countLabel="Total gift that you redeemed"
                            hideButton={true}
                        />
                    </div>
                </div>
        </div>
    )
}