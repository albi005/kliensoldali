import type {Todo} from "@/types.ts";
import {
    ListItem,
    ListItemText,
    Button,
    Checkbox,
    IconButton,
    TextField,
    Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DateTimeSelector from "@/components/DateTimeSelector.tsx";

export type TodoEditorProps = {
    todo: Todo
    /**
     * Called when a Todo has been modified
     * @param newValue the modified todo
     */
    onChange: (newValue: Todo) => void
    /**
     * Called when the Todo should be deleted
     */
    onDelete: () => void
    /**
     * Called when the user has finished editing the Todo and it should be updated on the server
     */
    onSave: () => void
}

/**
 * Allows editing the title, isDone, description and dueDate of a To-do.
 */
export default function TodoEditor({todo, onChange, onDelete, onSave}: TodoEditorProps) {
    return (
        <ListItem
            key={todo.id}
            secondaryAction={
                <IconButton edge="end" onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            }>
            <Checkbox
                checked={todo.isDone}
                onChange={(e) => onChange({...todo, isDone: e.target.checked})}
            />
            <Stack spacing={1} sx={{flex: 1, ml: 2}}>
                <TextField
                    fullWidth
                    label="Title"
                    value={todo.title}
                    onChange={(e) => onChange({...todo, title: e.target.value})}
                    size="small"
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={todo.description || ''}
                    onChange={(e) => onChange({...todo, description: e.target.value})}
                    multiline
                    rows={2}
                    size="small"
                />
                <DateTimeSelector value={todo.dueDate} onChange={
                    (newDate) => onChange({...todo, dueDate: newDate})
                }/>
                <Button onClick={onSave} variant="contained">
                    Save
                </Button>
            </Stack>
        </ListItem>
    );
}