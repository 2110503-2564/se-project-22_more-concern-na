import { Flag, PencilLine, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ReviewDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuItem className='cursor-pointer'>
          <PencilLine color='#00a0f0' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>
          <Trash color='red' />
          Delete
        </DropdownMenuItem>
        {
          /*role: hotel manager can report*/ <DropdownMenuItem className='cursor-pointer'>
            <Flag />
            Report
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
