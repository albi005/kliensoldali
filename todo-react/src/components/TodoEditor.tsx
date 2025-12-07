import type {Todo} from "@/types.ts";

export type TodoEditorProps = {
    todo: Todo
    onChange: (newValue: Todo) => void
    onDelete: () => void
}

export default function TodoEditor() {
    
}