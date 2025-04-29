import axios from 'axios';
import { UsersPointsResponse } from '../../interface';
import { apiPath } from './shared';

export const getUserPoints = async (
  page: number,
  pageSize: number,
  token: string,
): Promise<UsersPointsResponse> => {
  try {
    const response = await axios.get<UsersPointsResponse>(
      apiPath(`/users/points?page=${page}&pageSize=${pageSize}`),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(`Failed to fetch user points: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user points:', error);
    throw error;
  }
};

export const updateUserPoints = async (
  id: string,
  newPoint: number,
  token: string,
): Promise<boolean> => {
  try {
    const response = await axios.put(
      apiPath(`/users/points/${id}`),
      { point: newPoint },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error updating user points:', error);
    throw error;
  }
};
