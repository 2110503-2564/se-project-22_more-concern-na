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

interface ReviewDropDownProps {
  reviewId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: (reason: string) => void;
}

export default function ReviewDropDown({
  reviewId,
  onEdit,
  onDelete,
  onReport,
}: ReviewDropDownProps) {
  const reportReasons = [
    'Child Exploitation',
    'Bullying/Harassment',
    'Self-Harm/Suicide Content',
    'Violence/Graphic Content',
    'NSFW/Adult Content',
    'Spam/Unwanted Content',
    'Scam/Fraudulent Activity',
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        {onEdit && (
          <DropdownMenuItem className='cursor-pointer'>
            <PencilLine color='#00a0f0' />
            <span className='ml-2'>Edit</span>
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem className='cursor-pointer'>
            <Trash color='red' />
            <span className='ml-2'>Delete</span>
          </DropdownMenuItem>
        )}

        {/* Example "Report" submenu, can be shown/hidden based on user’s role */}
        {onReport && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Flag />
              <span className='ml-2'>Report</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='w-56'>
                {reportReasons.map((reason) => (
                  <DropdownMenuItem
                    key={reason}
                    className='cursor-pointer'
                    onClick={() => onReport(reason)}
                  >
                    {reason}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
