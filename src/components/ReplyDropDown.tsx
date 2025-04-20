import { PencilLine, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ReplyDropDownProps {
  onEditReply?: () => void;
  onDeleteReply?: () => void;
}

export default function ReplyDropDown({
  onEditReply,
  onDeleteReply,
}: ReplyDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuItem className='cursor-pointer' onClick={onEditReply}>
          <PencilLine color='#00a0f0' />
          <span className='ml-2'>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={onDeleteReply}>
          <Trash color='red' />
          <span className='ml-2'>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
