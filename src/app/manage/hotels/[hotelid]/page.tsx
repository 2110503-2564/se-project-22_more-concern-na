'use client';
import Loader from '@/components/Loader';
import Review, { ReviewType } from '@/components/Review';
import RoomCard from '@/components/RoomCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getHotel, getHotelReviews, updateHotel } from '@/lib/hotelService';
import dayjs from 'dayjs';
import { MapPin, Phone, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Rooms, IHotel } from '../../../../../interface';
import { useRouter } from 'next/navigation';

export default function ManageHotelDetail({
  params,
}: {
  params: Promise<{ hotelid: string }>;
}) {
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filteredreview, setfilteredReview] = useState<ReviewType[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { data: session } = useSession();
  const token = (session as any).user.token;
  const router = useRouter();

  useEffect(() => {
    const fetchHotel = async () => {
      const resolveParams = await params;
      const hotelId = resolveParams.hotelid;
      const response = await getHotel(hotelId);
      setHotel(response);
      setEditName(response.name || '');
      setEditAddress(
        `${response.buildingNumber} ${response.street}, ${response.district}, ${response.province} ${response.postalCode}` ||
          '',
      );
      setEditDescription(response.description || '');
      setLoading(false);
    };
    fetchHotel();
  }, [params]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const resolveParams = await params;
        const hotelId = resolveParams.hotelid;
        const response = await getHotelReviews(hotelId, {
          selfPage: 1,
          selfPageSize: 5,
          otherPage: 1,
          otherPageSize: 5,
        });

        const mappedReviews: ReviewType[] = response.self.data.map(
          (review, index) => ({
            id: index + 1,
            username: review.userName,
            avatarUrl: review.picture,
            date: dayjs(review.stayMonth).format('YYYY-MM-DD'),
            rating: review.rating,
            title: review.title,
            comment: review.text || '',
            reply: review.replyText
              ? {
                  id: 100 + index,
                  hotelName: hotel?.name || '',
                  avatarUrl: '/hotel-logo.png',
                  date: dayjs(review.stayMonth)
                    .add(1, 'day')
                    .format('YYYY-MM-DD'),
                  comment: review.replyText,
                }
              : undefined,
          }),
        );

        setfilteredReview(mappedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (hotel?._id) {
      fetchReviews();
    }
  }, [hotel?._id, params]);

  const handleDeleteReview = (reviewId: number) => {
    setfilteredReview((prevReviews) =>
      prevReviews.filter((r) => r.id !== reviewId),
    );
  };

  const handleDeleteReply = (reviewId: number, replyId: number) => {
    setfilteredReview((prevReviews) =>
      prevReviews.map((review) => {
        if (review.id === reviewId && review.reply?.id === replyId) {
          return { ...review, reply: undefined };
        } else {
          return review;
        }
      }),
    );
  };

  const formatPhone = (phoneNumber: string) => {
    return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  };

  const handleUpdateHotel = async () => {
    if (!hotel?._id) return;
    const addressParts = editAddress.split(',');
    const [buildingStreet, district, provincePostal] = addressParts.map(
      (part) => part.trim(),
    );
    const [buildingNumber, ...streetParts] = buildingStreet.split(' ');
    const street = streetParts.join(' ');
    const [province, postalCode] = provincePostal.split(' ');

    try {
      const res = await updateHotel(
        hotel._id,
        {
          name: editName,
          description: editDescription,
          buildingNumber,
          street,
          district,
          province,
          postalCode,
        },
        token,
      );

      if (res.success) {
        toast.success('Hotel updated successfully');
        setHotel((prev) =>
          prev
            ? {
                ...prev,
                name: editName,
                description: editDescription,
                buildingNumber,
                street,
                district,
                province,
                postalCode,
              }
            : prev,
        );
        setIsConfirmOpen(false);
      } else {
        toast.error('Update failed', {
          description: res.msg || 'Something went wrong',
        });
      }
    } catch (err: any) {
      toast.error('Update failed', {
        description: err.message || 'Something went wrong',
      });
    }
  };

  const originalAddress = hotel
    ? {
        name: hotel.name,
        buildingNumber: hotel.buildingNumber,
        street: hotel.street,
        district: hotel.district,
        province: hotel.province,
        postalCode: hotel.postalCode,
        description: hotel.description,
      }
    : null;

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  const fullAddress = `${hotel?.buildingNumber} ${hotel?.street}, ${hotel?.district}, ${hotel?.province} ${hotel?.postalCode}`;

  const handleManageRoom = (room: Rooms) => {
    router.push(`/manage/hotels/${hotel?._id}/${room._id}`);
  }

  return (
    <main className='flex-grow bg-luxe-dark text-white'>
      <div className='relative h-80 md:h-96'>
        <div
          className='absolute inset-0 bg-gray-600 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${hotel?.picture})` }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-base-gd via-transparent to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end'>
            <div>
              <h1 className='text-3xl md:text-4xl font-heading font-bold mb-2'>
                {hotel?.name}
              </h1>
              <div className='flex items-center mb-2'>
                <MapPin className='h-4 w-4 mr-1' />
                <span className='text-gray-300 font-detail'>{fullAddress}</span>
              </div>
              <div className='flex items-center'>
                <div className='flex items-center mr-4'>
                  <Star className='h-4 w-4 fill-amber-300 text-amber-300 mr-1' />
                  <span className='font-medium font-detail'>
                    {(hotel?.ratingCount ?? 0) > 0
                      ? (
                          (hotel?.ratingSum ?? 0) / (hotel?.ratingCount ?? 1)
                        ).toFixed(1)
                      : '0.0'}
                  </span>
                  <span className='text-gray-400 font-detail ml-2'>
                    ({hotel?.ratingCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 flex flex-col md:flex-row'>
        <div className='flex-1 md:mr-8'>
          <div className='text-lg font-normal font-detail text-white mb-8'>
            {hotel?.description}
            <div className='flex mt-3 items-center'>
              <Phone className='h-4 w-4 mr-2' />{' '}
              <span>{formatPhone(hotel?.tel ?? '')}</span>
            </div>
          </div>

          <h2 className='text-2xl font-bold mb-6 font-detail'>Our Rooms</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {hotel?.rooms?.map((room, index) => (
              <RoomCard
                key={index}
                room={room}
                type='manage'
                onManageRoom={() => {handleManageRoom(room)}}
              />
            ))}
          </div>

          <section className='mt-10'>
            <h2 className='text-2xl font-bold mb-6 font-detail'>
              Customer Reviews
            </h2>
            <div className='space-y-6'>
              {filteredreview.map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  onDeleteReview={handleDeleteReview}
                  onDeleteReply={handleDeleteReply}
                />
              ))}
            </div>
          </section>
        </div>

        <div className='md:w-96 mt-8 md:mt-0'>
          <div className='bg-[#0f172a] border border-gray-600 rounded-lg p-6 sticky top-6 text-white'>
            <h2 className='text-2xl font-heading mb-6'>Edit Hotel</h2>
            <div className='mb-4'>
              <label
                htmlFor='hotelName'
                className='block text-sm font-detail mb-1'
              >
                Hotel Name
              </label>
              <input
                id='hotelName'
                type='text'
                placeholder='Enter hotel name'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className='w-full p-2 rounded-md bg-gray-300 text-black'
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='hotelAddress'
                className='block text-sm font-detail mb-1'
              >
                Address
              </label>
              <input
                id='hotelAddress'
                type='text'
                placeholder='Enter hotel address'
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className='w-full p-2 rounded-md bg-gray-300 text-black'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='hotelDescription'
                className='block text-sm font-detail mb-1'
              >
                Description
              </label>
              <textarea
                id='hotelDescription'
                placeholder='Describe your hotel'
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className='w-full p-2 h-28 rounded-md bg-gray-300 text-black'
              />
            </div>

            <Button
              variant='golden'
              onClick={() => setIsConfirmOpen(true)}
              className='w-full'
            >
              Save Changes
            </Button>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <AlertDialogContent className='bg-bg-box border-bg-border text-white'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-white font-heading text-2xl'>
                    Confirm Hotel Updates
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-gray-300 font-detail'>
                    <div className='space-y-4 py-2'>
                      <div className='p-4 bg-[#2A2F3F] rounded-md'>
                        <h3 className='font-medium text-luxe-gold mb-2'>
                          Hotel Information
                        </h3>
                        <div className='text-sm space-y-2'>
                          <div className='flex justify-between'>
                            <span>Name:</span>
                            <span className='font-medium'>{editName}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Address:</span>
                            <span className='font-medium text-right mt-1'>
                              {editAddress}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className='font-medium text-luxe-gold mb-2'>
                          Description
                        </h3>
                        <div className='text-sm max-h-24 overflow-y-auto bg-[#2A2F3F] p-3 rounded-md'>
                          {editDescription}
                        </div>
                      </div>

                      <div className='flex justify-between pt-3 border-t border-gray-700'>
                        <span className='font-bold'>Changes Summary</span>
                        <span className='font-bold text-luxe-gold'>
                          {originalAddress?.name !== editName ||
                          originalAddress?.description !== editDescription ||
                          fullAddress !== editAddress
                            ? 'Modified'
                            : 'No Changes'}
                        </span>
                      </div>

                      <p className='text-xs text-gray-400 mt-4'>
                        By confirming these updates, the hotel information will
                        be immediately changed and reflected on the website for
                        all users.
                      </p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='gap-2'>
                  <AlertDialogCancel className='border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-gradient-to-r from-gold-gd1 to-gold-gd2 hover:bg-gradient-to-bl hover:from-gold-gd1 hover:to-gold-gd2 text-cardfont-cl'
                    onClick={handleUpdateHotel}
                  >
                    Confirm Updates
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </main>
  );
}