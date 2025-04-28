import axios from 'axios';
import {
  CreateRedeemableRedemptionResponse,
  RedeemableCouponsResponse,
  RedeemableGiftResponse,
  RedeemableGiftsResponse,
} from '../../interface';
import { apiPath } from './shared';

export const getAllCoupons = async (
  page: number,
  pageSize: number,
): Promise<RedeemableCouponsResponse> => {
  try {
    const response = await fetch(
      apiPath(`/redeemables/coupons?page=${page}&pageSize=${pageSize}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch coupons: ${response.status}`);
    }

    const data = await response.json();
    return data as RedeemableCouponsResponse;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const getAllGifts = async (
  page: number,
  pageSize: number,
): Promise<RedeemableGiftsResponse> => {
  try {
    const response = await fetch(
      apiPath(`/redeemables/gifts?page=${page}&pageSize=${pageSize}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch gifts: ${response.status}`);
    }

    const data = await response.json();
    return data as RedeemableGiftsResponse;
  } catch (error) {
    console.error('Error fetching gifts:', error);
    throw error;
  }
};

export const getGiftById = async (id: string): Promise<RedeemableGiftResponse> => {
  try {
    const response = await fetch(apiPath(`/redeemables/gifts/${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gift by ID: ${response.status}`);
    }

    const data = await response.json();
    return data as RedeemableGiftResponse;
  } catch (error) {
    console.error('Error fetching gift by ID:', error);
    throw error;
  }
}

export async function getPriceToPoint(token?: string): Promise<number> {
  const url = apiPath('/redeemables/price-to-point');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch priceToPoint: ${response.statusText}`);
  }

  const data = await response.json();

  if (!('priceToPoint' in data)) {
    throw new Error('Response does not contain priceToPoint');
  }

  return data.priceToPoint;
}


export const updateRedeemables = async(id: string, token: string): Promise<CreateRedeemableRedemptionResponse> => {
  try {
    const response = await axios.put(apiPath(`/redeemables/redemption`), {id}, {
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
    console.error(`Error updating redeemable with id ${id}:`, error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
}