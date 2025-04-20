import axios from 'axios';
import { GenericResponse } from '../../interface';
import { apiPath } from './shared';

export const addReport = async (
  reviewId: string,
  reason: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.post(
      apiPath(`/reports`),
      { review: reviewId, reportReason: reason },
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
    console.error('Error adding reply:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};
