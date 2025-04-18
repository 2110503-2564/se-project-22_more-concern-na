import axios from 'axios';
import {
  IBooking,
  BookingsRequest,
  BookingResponse,
  GenericResponse,
  PBooking,
} from '../../interface';
import { apiPath } from './shared';

export const getBookings = async (
  queryParams?: {
    pastPage?: number;
    pastPageSize?: number;
    activePage?: number;
    activePageSize?: number;
    upcomingPage?: number;
    upcomingPageSize?: number;
  },
  token?: string,
): Promise<{
  success: boolean;
  total?: number;
  past?: { pagination?: { count?: number; prev?: { page: number; limit: number }; next?: { page: number; limit: number } }; data?: PBooking[] };
  active?: { pagination?: { count?: number; prev?: { page: number; limit: number }; next?: { page: number; limit: number } }; data?: PBooking[] };
  upcoming?: { pagination?: { count?: number; prev?: { page: number; limit: number }; next?: { page: number; limit: number } }; data?: PBooking[] };
  msg?: string;
}> => {
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
): Promise<PBooking> => {
  try {
    const response = await axios.get(apiPath(`/bookings/${id}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    const BookingData = response.data
    return await BookingData.booking;
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
  bookingData: BookingsRequest,
  token?: string,
): Promise<GenericResponse> => {
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
  bookingData: Omit<BookingsRequest, 'hotel'>,
  token?: string,
): Promise<GenericResponse> => {
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
  bookingData: Partial<BookingsRequest>,
  token?: string,
): Promise<PBooking> => {
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

export const checkInBooking = async (
  id: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(apiPath(`/bookings/${id}/checkIn`), {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error checking in booking with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const completeBooking = async (
  id: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(apiPath(`/bookings/${id}/completed`), {}, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error completing booking with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};