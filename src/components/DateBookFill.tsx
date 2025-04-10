import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';

interface DateReserveProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs) => void;
  shouldDisableDate: (date: Dayjs) => boolean;
  disableBeforeDate?: Dayjs | null;
  disabled?: boolean;
}

export default function DateBookFill({
  selectedDate,
  onDateChange,
  shouldDisableDate,
  disableBeforeDate,
  disabled = false,
}: DateReserveProps) {
  const handleDateChange = (date: Dayjs | null) => {
    if (date && !shouldDisableDate(date)) {
      onDateChange(date);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={disabled}
        value={selectedDate}
        onChange={handleDateChange}
        shouldDisableDate={shouldDisableDate}
        disablePast
        className='bg-bg-textfill rounded border-bg-border w-full'
        sx={{ '& input': { color: '#ADAFB3' } }}
        slotProps={{
          openPickerIcon: { sx: { color: '#D2A047' } },
          openPickerButton: {
            sx: { color: '#D2A047', '&:hover': { backgroundColor: '#FFF4E0' } },
          },
        }}
      />
    </LocalizationProvider>
  );
}
