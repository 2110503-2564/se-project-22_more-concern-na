import axios from 'axios';
import {
  GenericResponse,
  HotelAvailabilityResponse,
  HotelResponse,
  HotelReviewsQuery,
  HotelReviewsResponse,
  IHotel,
} from '../../interface';
import { apiPath } from './shared';

export const getHotels = async (searchParams?: {
  name?: string;
  province?: string;
  page?: number;
  limit?: number;
}): Promise<HotelResponse> => {
  try {
    const response = await axios.get(apiPath('/hotels'), {
      params: searchParams,
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

export const getHotel = async (id: string): Promise<IHotel> => {
  try {
    const response = await axios.get(apiPath(`/hotels/${id}`));

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data.hotel;
  } catch (error) {
    console.error(`Error fetching hotel with ID ${id}:`, error);
    throw error;
  }
};

export const createHotel = async (
  hotel: Omit<IHotel, '_id'>,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.post(apiPath('/hotels'), hotel, {
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
    console.error('Error creating hotel:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const updateHotel = async (
  id: string,
  hotel: Partial<IHotel>,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(apiPath(`/hotels/${id}`), hotel, {
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
    console.error(`Error updating hotel with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const deleteHotel = async (
  id: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.delete(apiPath(`/hotels/${id}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error deleting hotel with ID ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const checkAvailability = async (
  hotelId: string,
  checkin: string,
  checkout: string,
  token?: string,
): Promise<HotelAvailabilityResponse> => {
  try {
    const response = await axios.get(apiPath(`/hotels/${hotelId}/available`), {
      params: {
        checkin,
        checkout,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error) {
    console.error(
      `Error checking availability for hotel ID ${hotelId}:`,
      error,
    );
    throw error;
  }
};

export const getHotelReviews = async (
  hotelId: string,
  queryParams: HotelReviewsQuery,
  token?: string,
): Promise<HotelReviewsResponse> => {
  try {
    const response = await axios.get(apiPath(`/hotels/${hotelId}/reviews`), {
      params: queryParams,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error) {
    console.error(`Error fetching reviews for hotel ID ${hotelId}:`, error);
    throw error;
  }
};
