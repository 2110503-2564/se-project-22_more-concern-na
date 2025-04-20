import axios from 'axios';
import { GenericResponse } from '../../interface';
import { apiPath } from './shared';

export const addReview = async (
  bookingId: string,
  reviewData: {
    title: string;
    text: string;
    rating: number;
  },
  token?: string,
) => {
  try {
    const response = await axios.post(
      apiPath(`/bookings/${bookingId}/reviews`),
      reviewData,
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
    console.error('Error adding review:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const updateReview = async (
  reviewId: string,
  reviewData: {
    title?: string;
    text?: string;
    rating?: number;
  },
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(
      apiPath(`/reviews/${reviewId}`),
      reviewData,
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
    console.error('Error updating review:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const deleteReview = async (
  reviewId: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.delete(apiPath(`/reviews/${reviewId}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.data;
  } catch (error: any) {
    console.error('Error deleting review:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const addReply = async (
  reviewId: string,
  replyData: {
    text: string;
  },
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.post(
      apiPath(`/reviews/${reviewId}/respond`),
      replyData,
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

export const updateReply = async (
  reviewId: string,
  replyData: {
    text: string;
  },
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(
      apiPath(`/reviews/${reviewId}/respond`),
      replyData,
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
    console.error('Error updating reply:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const deleteReply = async (
  reviewId: string,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.delete(
      apiPath(`/reviews/${reviewId}/respond`),
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
    console.error('Error deleting reply:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};
