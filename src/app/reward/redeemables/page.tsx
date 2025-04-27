import RedeemableGrid from "@/components/RedeemableGrid";
import { Separator } from "@/components/ui/separator";

export default function RedeemablesPage() {
    return <div>
        <RedeemableGrid cardType='coupon' cardView='redeem' rowCount={1}>
            <h1 className="text-center font-heading font-semibold text-white text-4xl">Coupons</h1>
        </RedeemableGrid>
    </div>
}