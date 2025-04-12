'use client';

import { RegisterForm, registerUser } from '@/lib/authService';
import { TextField } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SignUpPage = () => {
  const router = useRouter();

  const [userInput, setUserInput] = useState<RegisterForm>({
    email: '',
    password: '',
    name: '',
    tel: '',
  });

  const [feedBack, setFeedBack] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedBack('');

    const user = await registerUser(userInput);
    console.log(user);
    if (user) {
      if (user.success === false) {
        alert(user.msg);
        setFeedBack(user.msg || 'Registration failed');
        return;
      }
      const response = await signIn('credentials', {
        email: userInput.email,
        password: userInput.password,
        redirect: false,
      });
      if (response?.error) {
        setFeedBack('Registration Success, but Login failed');
      } else {
        setFeedBack('Login successful');
      }
      router.push('/');
    } else {
      setFeedBack('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex justify-center p-10'>
      <div className='flex flex-col items-center p-7 w-120 bg-white rounded-xl shadow-[0_0_5px_0_rgba(0,0,0,0.3)]'>
        <h1 className='text-3xl font-semibold text-blue-700 mb-1'>
          Create an Account
        </h1>
        <p className='text-lg mb-10 text-gray-500'>
          Sign up to start booking your hotel
        </p>
        <div className='w-full mb-5'>
          <TextField
            label='Full Name'
            name='name'
            variant='outlined'
            type='text'
            id='name'
            value={userInput.name}
            onChange={handleChange}
            required
            className='w-full p-3 border-2 border-blue-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='w-full mb-5'>
          <TextField
            label='Phone Number'
            name='tel'
            variant='outlined'
            type='text'
            id='tel'
            value={userInput.tel}
            onChange={handleChange}
            required
            className='w-full p-3 border-2 border-blue-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='w-full mb-5'>
          <TextField
            label='Email'
            name='email'
            variant='outlined'
            type='email'
            id='email'
            value={userInput.email}
            onChange={handleChange}
            required
            className='w-full p-3 border-2 border-blue-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='w-full mb-5'>
          <TextField
            label='Password'
            name='password'
            variant='outlined'
            type='password'
            id='password'
            value={userInput.password}
            onChange={handleChange}
            required
            className='w-full p-3 border-2 border-blue-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpPage;
