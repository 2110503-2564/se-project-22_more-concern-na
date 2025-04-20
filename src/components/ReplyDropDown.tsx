import { PencilLine, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ReplyDropDownProps {
  replyId: string;
  onEditReply?: (replyId: string) => void;
  onDeleteReply?: (replyId: string) => void;
}

export default function ReplyDropDown({
  replyId,
  onEditReply,
  onDeleteReply,
}: ReplyDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuItem className='cursor-pointer'>
          <PencilLine color='#00a0f0' />
          <span className='ml-2'>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>
          <Trash color='red' />
          <span className='ml-2'>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
