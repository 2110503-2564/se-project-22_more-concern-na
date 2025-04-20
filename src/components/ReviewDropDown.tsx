import { reportReasonE2I, reportReasonExternal } from '@/lib/utils';
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>...</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        {onEdit && (
          <DropdownMenuItem className='cursor-pointer' onClick={onEdit}>
            <PencilLine color='#00a0f0' />
            <span className='ml-2'>Edit</span>
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem className='cursor-pointer' onClick={onDelete}>
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
                {reportReasonExternal.map((reason) => (
                  <DropdownMenuItem
                    key={reason}
                    className='cursor-pointer'
                    onClick={() => onReport(reportReasonE2I(reason))}
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
