import {
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
};

export const createRedeemInventory = async (token: string, id: string): Promise<any> => {
  console.log(token);
  try {
    const response = await fetch(apiPath('/redeemables/redemption'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      throw new Error(`Failed to redeem item: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error redeeming item:', error);
    throw error;
  }
};