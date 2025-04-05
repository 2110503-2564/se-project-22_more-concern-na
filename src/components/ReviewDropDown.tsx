import { Flag, PencilLine, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ReviewDropDown() {
  const reportReason = [
    'Child Exploitation',
    'Bullying/Harassment',
    'Self-Harm/Suicide Content',
    'Violence/Graphic Content',
    'NSFW/Adult Content',
    'Spam/Unwanted Content',
    'Scam/Fraudulent Activity',
    'Other (Please specify)',
  ];
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Flag />
                Report
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='w-56'>
                  {reportReason.map((reason) => (
                    <DropdownMenuItem className='cursor-pointer'>
                      {reason}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
