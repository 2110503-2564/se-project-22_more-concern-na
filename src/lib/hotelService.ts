import axios from "axios";
import { apiPath } from "./shared";

export const getHotels = async (searchParams?: { hotel?: string; province?: string }) => {
    try {
        const response = await axios.get(apiPath("/hotels"), {
        params: searchParams,
        });

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
    
        return await response.data;

    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw error;
    }
}

export const getHotel = async (id: string) => {
    try {
        const response = await axios.get(apiPath(`/hotels/${id}`));

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        
        return await response.data;

    } catch (error) {
        console.error(`Error fetching hotel with ID ${id}:`, error);
        throw error;
    }
}