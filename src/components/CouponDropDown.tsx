import { TicketPercent } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ReviewDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TicketPercent />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuItem className='cursor-pointer'>coupon1</DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>coupon2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
