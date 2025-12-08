import type {Todo} from "@/types.ts";
import {Checkbox, ListItem, ListItemButton, ListItemText} from "@mui/material";
import Markdown from "marked-react";
import DateDisplay from "@/components/DateDisplay.tsx";
import {Stack} from "@mui/material";

export interface TodoPreviewProps {
    todo: Todo
    /**
     * Called when the To-do should be selected for editing.
     */
    onSelect: () => void
    /**
     * Called when the To-do's isDone state should be changed.'
     * @param checked the new isDone state of the To-do
     */
    onChecked: (checked: boolean) => void
}

/**
 * Renders the title and description of a To-do. Additionally, allows checking the To-do.
 */
export default function TodoPreview({todo, onSelect, onChecked}: TodoPreviewProps) {
    return <ListItem
        key={todo.id}
        secondaryAction={
            <Checkbox edge="end"
                onClick={() => onChecked(!todo.isDone)}
                checked={todo.isDone}
            />
        }
        disablePadding>
        <ListItemButton onClick={onSelect}>
            <ListItemText
                primary={<Stack direction="row" gap={1}><b>{todo.title}</b><DateDisplay date={todo.dueDate}/></Stack>}
                secondary={<Markdown value={todo.description}/>}
            />
        </ListItemButton>
    </ListItem>;
}