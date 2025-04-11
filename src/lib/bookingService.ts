import axios from 'axios';
import {
  Booking,
  BookingQuery,
  BookingRequest,
  BookingResponse,
  CreateBookingResponse,
  GenericResponse,
} from '../../interface';
import { apiPath } from './shared';

export const getBookings = async (
  queryParams?: BookingQuery,
  token?: string,
): Promise<BookingResponse> => {
  try {
    const response = await axios.get(apiPath('/bookings'), {
      params: queryParams,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const getBooking = async (
  id: string,
  token?: string,
): Promise<Booking> => {
  try {
    const response = await axios.get(apiPath(`/bookings/${id}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data.booking;
  } catch (error: any) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const createBooking = async (
  bookingData: BookingRequest,
  token?: string,
): Promise<CreateBookingResponse> => {
  try {
    const response = await axios.post(apiPath('/bookings'), bookingData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 201) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error('Error creating booking:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const createHotelBooking = async (
  hotelId: string,
  bookingData: Omit<BookingRequest, 'hotel'>,
  token?: string,
): Promise<CreateBookingResponse> => {
  try {
    const bookingWithHotel = {
      ...bookingData,
      hotel: hotelId,
    };

    return await createBooking(bookingWithHotel, token);
  } catch (error) {
    console.error(`Error creating booking for hotel ${hotelId}:`, error);
    throw error;
  }
};

export const updateBooking = async (
  id: string,
  bookingData: Partial<BookingRequest>,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(apiPath(`/bookings/${id}`), bookingData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error updating booking with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const deleteBooking = async (
  id: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.delete(apiPath(`/bookings/${id}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};
