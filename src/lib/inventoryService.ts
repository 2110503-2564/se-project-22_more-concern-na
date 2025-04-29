import { InventoryCouponsResponse, InventoryGiftsResponse } from '../../interface';
import { apiPath } from './shared';

export const getInventoryCoupons = async (page: number, pageSize: number, token?: string): Promise<InventoryCouponsResponse> => {
  try {
    const response = await fetch(apiPath(`/inventory/coupons?page=${page}&pageSize=${pageSize}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch coupons: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const getInventoryGifts = async (page: number, pageSize: number, token?: string): Promise<InventoryGiftsResponse> => {
  try {
    const response = await fetch(apiPath(`/inventory/gifts?page=${page}&pageSize=${pageSize}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gifts: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gifts:', error);
    throw error;
  }
};
