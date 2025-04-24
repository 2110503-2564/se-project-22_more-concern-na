'use client';

import { SquareChevronLeft, SquareChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PageNavigatorProps {
  page: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PageNavigator({
  page,
  onPrev,
  onNext,
}: PageNavigatorProps) {
  return (
    <div className='flex items-center justify-center gap-4'>
      <Button
        variant='ghost'
        onClick={onPrev}
        className='p-1 bg-gold-gd1 hover:bg-gold-gd2'
      >
        <SquareChevronLeft className='text-bg-box' />
      </Button>
      <span className='text-white font-detail'>Page {page}</span>

      <Button
        variant='ghost'
        onClick={onNext}
        className='p-1 bg-gold-gd1 hover:bg-gold-gd2'
      >
        <SquareChevronRight className='text-bg-box' />
      </Button>
    </div>
  );
}
