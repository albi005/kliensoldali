import type {Todo} from "@/types.ts";
import {Checkbox, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {marked} from "marked";
import {useMemo} from "react";
import Markdown from "marked-react";

export interface TodoPreviewProps {
    todo: Todo
    onRemove: () => void
    onSelect: () => void
}

export default function TodoPreview({todo, onSelect, onRemove}: TodoPreviewProps) {
    const descHtml = useMemo(
        () => todo.description
            ? marked(todo.description, {async: false}) as string
            : null,
        [todo.description]
    );
    
    return <ListItem
        key={todo.id}
        secondaryAction={
            <Checkbox edge="end"
                // onChange={handleToggle(value)}
                // checked={checked.includes(value)}
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