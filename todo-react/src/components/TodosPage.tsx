import {useEffect, useState} from "react";
import {useAuth} from "@/components/AuthProvider.tsx";
import {requestTodos} from "@/Server.ts";
import type {Todo} from "@/types.ts";
import TodoPreview from "@/components/TodoPreview.tsx";
import List from "@mui/material/List";


export function TodosPage() {
    const {userId} = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [prevUserId, setPrevUserId] = useState<string | null>(null);
    const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

    useEffect(() => {
        if (userId === prevUserId) return;
        setPrevUserId(userId);

        if (!userId) {
            setTodos([]);
            return;
        }

        (async () => {
            const todos = await requestTodos();
            setTodos(todos);
        })();

    }, [userId]);

    return <>
        <List>
            {
                todos.map(todo => {
                    return <TodoPreview
                        todo={todo}
                        onRemove={() => setTodos(ts => ts.filter(t => t.id !== todo.id))}
                        onSelect={() => setSelectedTodoId(todo.id)}
                    />;
                })
            }
        </List>
    </>;
}