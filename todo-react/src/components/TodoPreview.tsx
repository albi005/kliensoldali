import type {Todo} from "@/types.ts";
import {Checkbox, ListItem, ListItemButton, ListItemText} from "@mui/material";
import Markdown from "marked-react";

export interface TodoPreviewProps {
    todo: Todo
    onSelect: () => void
    onChecked: (checked: boolean) => void
}

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
                primary={<b>{todo.title}</b>}
                secondary={<Markdown value={todo.description}/>}
            />
        </ListItemButton>
    </ListItem>;
}