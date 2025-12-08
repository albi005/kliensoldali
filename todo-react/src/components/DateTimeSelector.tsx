import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

export type DateTimeSelectorProps = {
    value?: Date;
    onChange: (date: Date | undefined) => void;
}

/**
 * Allows selecting a date and a time in the form of a JS Date.
 * @param value the currently selected date and time, or undefined if no date is selected
 * @param onChange a callback invoked when the selected date and time changes
 */
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