import { PencilLine, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ReplyDropDownProps {
  replyId: number;
  onEditReply: (replyId: number) => void;
  onDeleteReply: (replyId: number) => void;
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
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => onEditReply(replyId)}
        >
          <PencilLine color='#00a0f0' />
          <span className='ml-2'>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => onDeleteReply(replyId)}
        >
          <Trash color='red' />
          <span className='ml-2'>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
