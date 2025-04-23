import React from 'react';
import { Calendar, Coins, Gift } from 'lucide-react';

export default function RewardsPage() {
    return (
        <div className="text-white font-sans p-8 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-semibold font-heading mb-2">Reward Information</h1>
            <p className="text-xl text-gray-300 font-detail">Shop more, get more rewards, enjoy benefits</p>
          </div>
    
          {/* Description Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 font-heading">How Our Rewards Program Works</h2>
            <p className="text-xl font-detail leading-relaxed max-w-4xl">
              Our rewards program lets you earn rewards on every purchase that you can redeem for discounts,
              free products, exclusive experiences, and more. The more you shop, the more you earn!
            </p>
          </div>
    
          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8">
              <div className="flex items-center mb-3">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Calendar color="black" size={20} />
                </div>
                <h3 className="text-2xl font-semibold font-heading">1. Book & Earn</h3>
              </div>
              <p className="text-gray-300 font-detail">Earn rewards for every purchase</p>
            </div>
    
            {/* Step 2 */}
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8">
              <div className="flex items-center mb-3">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Coins color="black" size={20} />
                </div>
                <h3 className="text-2xl font-semibold font-heading">2. Collect Benefits</h3>
              </div>
              <p className="text-gray-300 font-detail">Unlock special offers and promotions</p>
            </div>
    
            {/* Step 3 */}
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8">
              <div className="flex items-center mb-3">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-3 relative">
                  <Gift color="black" size={20} />
                </div>
                <h3 className="text-2xl font-semibold font-heading">3. Redeem Rewards</h3>
              </div>
              <p className="text-gray-300 font-detail">Use your rewards for discounts, free products, and exclusive experiences</p>
            </div>
          </div>
        </div>
      );
}