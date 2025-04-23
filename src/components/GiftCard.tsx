'use client';
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface GiftCardProps {
    id: string;
    name: string;
    point: number;
    description?: string;
    picture?: string;
    remain: number;
    type: 'view' | 'redeem';
}

export const GiftCard = ({
    id,
    name,
    point,
    description,
    picture,
    remain,
    type,
}: GiftCardProps) => {
    const router = useRouter();

    const handleClick = () => {
        //router.push(`/reward/reemables/${id}`);
        router.push(`/`);
      };

    return (
        <div className="flex flex-col w-full max-w-xs rounded-xl overflow-hidden shadow-lg" onClick={handleClick}>
            {/* Top section with points and badge */}
            <div className="relative h-48">
                {/* Background image */}
                {picture ? (
                    <img
                        src={picture}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-base-gd" />
                )}
                
                {/* Content overlay */}
                <div className="absolute inset-0 p-4 flex items-start justify-between">
                    {/* Badge/Logo */}
                    <div className="bg-gray-800 rounded-full p-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-full h-full bg-gray-600 rounded-full" />
                        </div>
                    </div>
                    
                    {/* Points display */}
                    <div className="text-right">
                        <span className="font-number text-white text-lg">{point} Points</span>
                    </div>
                </div>
            </div>
            
            {/* Bottom section with details */}
            <div className="bg-gradient-to-b from-gold-gd1 to-gold-gd2 p-4 flex flex-col">
                {/* Remaining counter */}
                <div className="text-right mb-2">
                    <span className="font-number text-cardfont-cl text-lg">{remain} Remaining</span>
                </div>
                
                {/* Gift name */}
                <h3 className="font-heading text-cardfont-cl text-3xl text-center mb-2">{name}</h3>
                
                {/* Description */}
                <p className="font-detail text-cardfont-detail text-center mb-4">
                    {description || "Description"}
                </p>
                
                {/* Action button - only show when type is 'redeem' */}
                {type === 'redeem' && (
                    <Button 
                        className="w-full bg-bg-btn hover:bg-bg-btn-hover text-white py-2 rounded" onClick={(e) => {e.stopPropagation()}}
                    >
                        Redeem
                    </Button>
                )}
            </div>
        </div>
    );
};