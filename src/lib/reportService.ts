import axios from 'axios';
import {
  AllReportResponse,
  CreateReportBody,
  GenericResponse,
} from '../../interface';
import { apiPath } from './shared';

export const addReport = async (
  report: CreateReportBody & { token?: string },
): Promise<GenericResponse> => {
  try {
    const response = await axios.post(apiPath(`/reports`), report, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: report.token ? `Bearer ${report.token}` : undefined,
      },
    });

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

export const getAllReports = async (
  token?: string,
): Promise<AllReportResponse> => {
  try {
    const response = await axios.get(apiPath('/reports'), {
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
    console.error('Error fetching reports:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};

export const ignoreReport = async (
  reportId: string,
  isIgnore: boolean,
  token?: string,
): Promise<GenericResponse> => {
  try {
    const response = await axios.put(
      apiPath(`/reports/${reportId}`),
      { isIgnore: isIgnore },
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
    console.error('Error ignoring report:', error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.msg || `Error: ${error.response.status}`,
      );
    }
    throw error;
  }
};
