import axios from 'axios';
import { GenericResponse, Rooms } from '../../interface';
import { apiPath } from './shared';

export const addRoom = async (
  hotelId: string,
  roomData: Omit<Rooms, '_id'>,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.post(
      apiPath(`/hotels/${hotelId}/rooms`),
      roomData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    );

    if (response.status !== 201) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error adding room to hotel ${hotelId}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const updateRoom = async (
  hotelId: string,
  roomId: string,
  roomData: Partial<Rooms>,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(
      apiPath(`/hotels/${hotelId}/rooms/${roomId}`),
      roomData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(`Error updating room ${roomId} in hotel ${hotelId}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const deleteRoom = async (
  hotelId: string,
  roomId: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.delete(
      apiPath(`/hotels/${hotelId}/rooms/${roomId}`),
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error(
      `Error deleting room ${roomId} from hotel ${hotelId}:`,
      error,
    );
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const getRooms = async (hotelId: string): Promise<Rooms[]> => {
  try {
    const response = await axios.get(apiPath(`/hotels/${hotelId}`));

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return (await response.data.hotel.rooms) || [];
  } catch (error) {
    console.error(`Error fetching rooms for hotel ${hotelId}:`, error);
    throw error;
  }
};

export const getRoom = async (
  hotelId: string,
  roomId: string,
): Promise<Rooms | null> => {
  try {
    const rooms = await getRooms(hotelId);
    const room = rooms.find((room) => room._id === roomId);
    return (await room) || null;
  } catch (error) {
    console.error(
      `Error fetching room ${roomId} from hotel ${hotelId}:`,
      error,
    );
    throw error;
  }
};
