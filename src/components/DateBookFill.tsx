import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';

interface DateReserveProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs) => void;
  shouldDisableDate: (date: Dayjs) => boolean;
  disableBeforeDate?: Dayjs | null;
}

export default function DateBookFill({
  selectedDate,
  onDateChange,
  shouldDisableDate,
  disableBeforeDate,
}: DateReserveProps) {
  const handleDateChange = (date: Dayjs | null) => {
    if (date && !shouldDisableDate(date)) {
      onDateChange(date);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        shouldDisableDate={shouldDisableDate}
        disablePast
        className='bg-bg-textfill text-bg-placeholder rounded border-bg-border w-full'
      />
    </LocalizationProvider>
  );
}
