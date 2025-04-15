'use client';

import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedBack, setFeedBack] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedBack('');
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (response?.error) {
      setFeedBack('Login failed');
    } else {
      setFeedBack('Login successful');
      router.push('/');
    }
  };

  return (
    <form onSubmit={onSubmit} className='flex justify-center p-10'>
      <div className='flex flex-col items-center p-7 w-120 bg-bg-box rounded-xl shadow-[0_0_5px_0_rgba(0,0,0,0.3)]'>
        <h1 className='text-3xl font-semibold text-white font-heading mb-1'>
          Welcome Back
        </h1>
        <p className='text-lg mb-10 text-gray-500'>
          Sign in to your account to continue
        </p>

        <div className='w-full mb-8'>
          <TextField
            label='Email'
            name='email'
            variant='filled'
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full p-3 border-2 font-heading bg-bg-textfill border-bg-border rounded-md text-lg focus:outline-none focus:ring-2'
          />
        </div>

        <div className='w-full mb-8'>
          <TextField
            label='Password'
            name='password'
            variant='filled'
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full p-3 border-2 bg-bg-textfill border-bg-border rounded-md text- focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-bg-placeholder'
          />
        </div>

        <Button
          type='submit'
          variant="golden"
          className='w-full p-3'
          disabled={!email || !password}
        >
          Log In
        </Button>
        <p className='mt-4 text-center text-white font-detail'>
          Don't have an account?{' '}
          <span
            className='text-gold-gd1 underline cursor-pointer'
            onClick={() => router.push('/api/auth/signup')}
          >
            Create an account
          </span>
        </p>

        {feedBack && (
          <p
            className={`mt-4 text-center ${feedBack === 'Login successful' ? 'text-green-600' : 'text-red-600'}`}
          >
            {feedBack}
          </p>
        )}
      </div>
    </form>
  );
};

export default LoginPage;
