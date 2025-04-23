import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
interface GiftDetailProps {
  id: string;
  name: string;
  description?: string;
  point: string;
  picture?: string;
  remain?: number;
  type: 'view' | 'redeem';
}

export default function GiftDetail({
  name,
  description,
  point,
  picture,
  remain,
  type,
}: GiftDetailProps) {
    const router = useRouter();
  return (
    <div className='w-full'>
      {/* Heading outside the box */}
      <h2 className='text-6xl font-bold font-heading mb-9 ml-6'>Gift Detail</h2>

      {/* Gift box */}
      <div className='bg-[#0F172A] text-white p-6 border border-gray-700'>
        <div className='flex flex-col md:flex-row items-center gap-6 p-10'>
          
          {/* Picture & Point Section */}
        <div className="relative flex-shrink-0">
          <div className="bg-gray-300 rounded-md overflow-hidden">
            {picture ? (
              <img src={picture} alt={name} width={0} height={0} className="w-full h-full object-cover" />
            ) :  (<img src={"/defaultHotel.png"} alt={name} width={0} height={0} className="w-100 h-100 object-cover" />)}
          </div>
          <div className="flex absolute bottom-0 w-full h-10 bg-gradient-to-r from-gold-gd1 to-gold-gd2 text-black text-2xl font-light items-center justify-center font-detail py-1 rounded-b-md">
            {point} Points
          </div>
        </div>

          {/* Info Section */}
          <div className='flex-1 text-left ml-20'>
            <div
              className='text-5xl font-heading font-semibold text-gold-gd1 mb-6'
              data-testid='name'
            >
              {name}
              {type === 'redeem' && remain !== undefined ? (
                <span
                  className='text-2xl text-gray-300 font-heading ml-4'
                  data-testid='remain'
                >
                  • {remain} Remaining
                </span>
              ) : null}
            </div>
            <p
              className='break-all mt-2 text-gray-200 text-xl font-detail leading-relaxed ml-4'
              data-testid='description'
            >
              {description}
            </p>

            {/* Redeem Button positioned to the right */}
            {type === 'redeem' && parseInt(point) > 0 ? (
              <div className='flex justify-end mt-10'>
                <Button className='w-50 h-14 text-2xl mr-26 cursor-pointer' variant='golden'>
                  Redeem
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
