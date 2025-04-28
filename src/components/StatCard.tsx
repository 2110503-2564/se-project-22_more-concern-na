import React from 'react';
import { Button } from './ui/button';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  count: number;
  countLabel: string;
  buttonText?: string;
  onButtonClick?: () => void;
  hideButton?: boolean;
}

export default function StatCard({
  icon,
  title,
  subtitle,
  count,
  countLabel,
  buttonText,
  onButtonClick,
  hideButton,
}: StatCardProps) {
  return (
    <div className='bg-bg-box border border-bg-border p-8 rounded-sm flex flex-col h-full font-detail'>
      <div className='flex items-center mb-2'>
        {icon}
        <h2 className='text-white text-3xl ml-4 font-heading'>{title}</h2>
      </div>
      <p className='text-gray-400 text-sm mb-4'>{subtitle}</p>

      <div className='mt-4'>
        <span className='text-white text-6xl font-bold font-number'>
          {count}
        </span>
      </div>
      <p className='text-gray-400 mb-8'>{countLabel}</p>

      {!hideButton && (
        <Button
          variant='golden'
          onClick={onButtonClick}
          className='mt-auto rounded-sm flex items-center justify-center'
        >
          {buttonText}
          <svg
            className='w-4 h-4 ml-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M14 5l7 7m0 0l-7 7m7-7H3'
            />
          </svg>
        </Button>
      )}
    </div>
  );
}
