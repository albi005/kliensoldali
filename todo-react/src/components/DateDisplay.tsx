export type DateDisplayProps = {
    date?: Date
}

/**
 * Displays the given date or renders nothing if undefined.
 */
export default function DateDisplay({date}: DateDisplayProps) {
    if (!date)
        return null;

    return <span style={{fontWeight: "lighter"}}>
        {date.toLocaleDateString()}
    </span>;
}