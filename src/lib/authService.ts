import axios from 'axios';
import { apiPath } from './shared';
import { UserResponse } from '../../interface';

export const loginUser = async (email: string, password: string) => {
  const jsonBody = JSON.stringify({ email, password });
  return await fetch(apiPath('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonBody,
  })
    .then((response) => {
      return response.ok ? response.json() : Promise.reject(response);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

export const getCurrentUser = async (token?: string) => {
  const res = await fetch(apiPath('/auth/getMe'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (res.status === 200) {
    return json;
  }
  return undefined;
};

export const getUsers = async (token?: string): Promise<UserResponse> => {
  const res = await axios.get(apiPath('/users/'), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  })
  if(res.status !== 200){
    throw new Error(`Error: ${res.status}`);
  }

  const userResponse = await res.data;
  return userResponse;

}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  tel: string;
  hotel?: string;
  role?: string;
}

export const registerUser = async (data: RegisterForm | undefined) => {
  const res = await fetch(apiPath('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, role: 'user' }),
  });
  const json = await res.json();
  if (res.status === 200 || (json && json.success === false)) {
    return json;
  }
  return null;
};

export const updateUser = async (
  data: Partial<RegisterForm | undefined>,
  token?: string,
) => {
  const res = await fetch(apiPath('/auth/update'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (res.status === 201 || (json && json.success === false)) {
    return json;
  }
  return null;
};
