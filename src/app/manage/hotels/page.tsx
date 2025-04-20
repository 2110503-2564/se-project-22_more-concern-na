'use client';
import HotelCard from '@/components/HotelCard';
import Loader from '@/components/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createHotel, deleteHotel, getHotels } from '@/lib/hotelService';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { HotelResponse, IHotel, Rooms } from '../../../../interface';

export default function ManageHotels() {
  const [hotels, setHotels] = useState<HotelResponse>({
    success: false,
    count: 0,
    data: [],
    pagination: {
      next: { page: 0, limit: 0 },
      prev: { page: 0, limit: 0 },
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newHotel, setNewHotel] = useState<IHotel>({
    name: '',
    description: '',
    picture: '',
    buildingNumber: '',
    street: '',
    district: '',
    province: '',
    postalCode: '',
    tel: '',
    rooms: [],
    ratingSum: 0,
    ratingCount: 0,
  });

  // Add state for room management
  const [addRooms, setAddRooms] = useState<boolean>(false);
  const [newRoom, setNewRoom] = useState<Rooms>({
    roomType: '',
    picture: '',
    capacity: 1,
    maxCount: 1,
    price: 0,
  });

  const router = useRouter();

  const { data: session } = useSession();
  const token = (session as any)?.user?.token;

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      const responseData = await getHotels();
      setHotels(responseData);
      setIsLoading(false);
    };
    fetchHotels();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (name === 'capacity' || name === 'maxCount' || name === 'price') {
      setNewRoom((prev) => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value),
      }));
    } else {
      setNewRoom((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setNewHotel({
      name: '',
      description: '',
      picture: '',
      buildingNumber: '',
      street: '',
      district: '',
      province: '',
      postalCode: '',
      tel: '',
      rooms: [],
      ratingSum: 0,
      ratingCount: 0,
    });
    setAddRooms(false);
    setNewRoom({
      roomType: '',
      picture: '',
      capacity: 1,
      maxCount: 1,
      price: 0,
    });
  };

  const addRoomToHotel = () => {
    if (!newRoom.roomType) {
      toast.error('Validation Error: Room type is required');
      return;
    }
    
    const roomWithId = {
      ...newRoom,
      _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setNewHotel((prev) => ({
      ...prev,
      rooms: [...prev.rooms, roomWithId],
    }));
    
    setNewRoom({
      roomType: '',
      picture: '',
      capacity: 1,
      maxCount: 1,
      price: 0,
    });

    toast.success(`${newRoom.roomType} has been added to the hotel`);
  };

  const removeRoom = (index: number) => {
    setNewHotel((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newHotel.name || !newHotel.buildingNumber || !newHotel.tel) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const hotelToSend = JSON.parse(JSON.stringify(newHotel));
      
      hotelToSend.rooms = hotelToSend.rooms.map(({ _id, ...room }: any) => room);
      
      setIsLoading(true);
      await createHotel(hotelToSend, token);
      
      setDialogOpen(false);
      resetForm();
      
      const responseData = await getHotels();
      setHotels(responseData);
      
      toast.success(`Hotel has been created successfully`);
    } catch (error: any) {
      console.error('Error creating hotel:', error);
      toast.error(error.message || 'Failed to create hotel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      
      await deleteHotel(hotelId, token);
      
      setHotels(prev => ({
        ...prev,
        data: prev.data.filter((hotel) => hotel._id !== hotelId),
        count: prev.count - 1,
      }));

      toast.success('Hotel deleted successfully');
    } catch (error: any) {
      console.error('Error deleting hotel:', error);
      toast.error(error.message || 'Failed to delete hotel');
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='relative pb-16'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 place-items-center'>
        {hotels.data.map((hotel: IHotel, index) => (
          <HotelCard
            key={index}
            type='edit'
            hotel={hotel}
            onDelete={handleDeleteHotel}
          />
        ))}
      </div>

      {/* Floating Add Button */}
      <div className='fixed bottom-8 right-8 z-10'>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button size='lg' className='rounded-full shadow-lg'>
              Add Hotel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleFormSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Hotel</AlertDialogTitle>
                <AlertDialogDescription>
                  Fill in the details to add a new hotel to your collection.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
                <div className='space-y-2 col-span-2'>
                  <Label htmlFor='name'>Hotel Name</Label>
                  <Input
                    id='name'
                    name='name'
                    value={newHotel.name}
                    onChange={handleInputChange}
                    placeholder='Hotel Name'
                    required
                  />
                </div>

                <div className='space-y-2 col-span-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    name='description'
                    value={newHotel.description}
                    onChange={handleInputChange}
                    placeholder='Hotel Description'
                    rows={3}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='picture'>Picture URL</Label>
                  <Input
                    id='picture'
                    name='picture'
                    value={newHotel.picture}
                    onChange={handleInputChange}
                    placeholder='Picture URL'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='tel'>Phone Number</Label>
                  <Input
                    id='tel'
                    name='tel'
                    value={newHotel.tel}
                    onChange={handleInputChange}
                    placeholder='Phone Number'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='buildingNumber'>Building Number</Label>
                  <Input
                    id='buildingNumber'
                    name='buildingNumber'
                    value={newHotel.buildingNumber}
                    onChange={handleInputChange}
                    placeholder='Building Number'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='street'>Street</Label>
                  <Input
                    id='street'
                    name='street'
                    value={newHotel.street}
                    onChange={handleInputChange}
                    placeholder='Street'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='district'>District</Label>
                  <Input
                    id='district'
                    name='district'
                    value={newHotel.district}
                    onChange={handleInputChange}
                    placeholder='District'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='province'>Province</Label>
                  <Input
                    id='province'
                    name='province'
                    value={newHotel.province}
                    onChange={handleInputChange}
                    placeholder='Province'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='postalCode'>Postal Code</Label>
                  <Input
                    id='postalCode'
                    name='postalCode'
                    value={newHotel.postalCode}
                    onChange={handleInputChange}
                    placeholder='Postal Code'
                    required
                  />
                </div>
              </div>

              {/* Add checkbox for adding rooms */}
              <div className='flex items-center space-x-2 mt-4 mb-2'>
                <Checkbox
                  id='addRooms'
                  checked={addRooms}
                  onCheckedChange={(checked) => setAddRooms(checked as boolean)}
                />
                <Label htmlFor='addRooms' className='font-medium'>
                  Add rooms to this hotel?
                </Label>
              </div>

              {/* Show room management UI when checkbox is checked */}
              {addRooms && (
                <div className='mt-4 border-t pt-4'>
                  <h3 className='text-lg font-medium mb-3'>Hotel Rooms</h3>

                  {/* Room input form */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='roomType'>Room Type</Label>
                      <Input
                        id='roomType'
                        name='roomType'
                        value={newRoom.roomType}
                        onChange={handleRoomInputChange}
                        placeholder='Deluxe, Standard, etc.'
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roomPicture">Room Picture URL</Label>
                      <Input
                        id='roomPicture'
                        name='picture'
                        value={newRoom.picture}
                        onChange={handleRoomInputChange}
                        placeholder='Room Picture URL'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='capacity'>Capacity</Label>
                      <Input
                        id='capacity'
                        name='capacity'
                        type='number'
                        min={1}
                        value={newRoom.capacity}
                        onChange={handleRoomInputChange}
                        placeholder='Number of people'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='maxCount'>Available Rooms</Label>
                      <Input
                        id='maxCount'
                        name='maxCount'
                        type='number'
                        min={1}
                        value={newRoom.maxCount}
                        onChange={handleRoomInputChange}
                        placeholder='Number of rooms available'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='price'>Price (per night)</Label>
                      <Input
                        id='price'
                        name='price'
                        type='number'
                        min={0}
                        value={newRoom.price}
                        onChange={handleRoomInputChange}
                        placeholder='Price'
                      />
                    </div>

                    <div className='flex items-end space-x-2'>
                      <Button
                        type='button'
                        onClick={addRoomToHotel}
                        className='flex items-center'
                      >
                        <PlusCircle className='mr-2 h-4 w-4' />
                        Add Room
                      </Button>
                    </div>
                  </div>

                  {/* Display added rooms */}
                  {newHotel.rooms.length > 0 ? (
                    <div className='space-y-3 mt-4'>
                      <h4 className='text-sm font-medium'>Added Rooms:</h4>
                      {newHotel.rooms.map((room, index) => (
                        <Card key={index} className='relative'>
                          <CardContent className='p-4'>
                            <div className='flex justify-between items-center'>
                              <div>
                                <h5 className='font-medium'>{room.roomType}</h5>
                                <p className='text-sm text-gray-500'>
                                  Capacity: {room.capacity} | Available:{' '}
                                  {room.maxCount} | Price: ${room.price}/night
                                </p>
                              </div>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => removeRoom(index)}
                                className='h-8 w-8'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className='text-sm text-gray-500 italic'>
                      No rooms added yet.
                    </p>
                  )}
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Add Hotel</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Empty state when no hotels */}
      {hotels.data.length === 0 && (
        <div className='flex flex-col items-center justify-center h-64'>
          <h3 className='text-xl font-medium mb-4'>No hotels available</h3>
          <p className='text-gray-500 mb-4'>
            Get started by adding your first hotel
          </p>
        </div>
      )}
    </div>
  );
}
