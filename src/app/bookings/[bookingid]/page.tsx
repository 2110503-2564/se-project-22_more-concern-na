export default function BookingDetailPage({
  params,
}: {
  params: { bookingid: string };
}) {
  return (
    <main className='text-center p-5 text-white'>
      <h1 className='text-lg font-medium'>Booking ID {params.bookingid}</h1>
    </main>
  );
}
