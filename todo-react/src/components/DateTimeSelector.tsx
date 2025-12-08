import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

export type DateTimeSelectorProps = {
    value?: Date;
    onChange: (date: Date | undefined) => void;
}

export default function DateTimeSelector({value, onChange}: DateTimeSelectorProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                value={value}
                onChange={(newValue) => onChange(newValue ?? undefined)}
            />
        </LocalizationProvider>
    );
}