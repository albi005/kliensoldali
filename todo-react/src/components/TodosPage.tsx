import {useEffect, useState} from "react";
import {useAuth} from "@/components/AuthProvider.tsx";
import {requestTodos, saveTodo} from "@/Server.ts";
import type {Todo} from "@/types.ts";
import TodoPreview from "@/components/TodoPreview.tsx";
import List from "@mui/material/List";
import TodoEditor from "@/components/TodoEditor.tsx";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";

export function TodosPage() {
    const {userId} = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [prevUserId, setPrevUserId] = useState<string | null>(null);
    const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
    const [newTodo, setNewTodo] = useState<Todo>({id: 0, title: "", isDone: false});

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
    
    const onRemove = (id: number)   => setTodos(ts => ts.filter(t => t.id !== id));
    const onModify = (newTodo: Todo) => setTodos(ts => ts.map(t => t.id === newTodo.id ? newTodo : t));
    const onAdd = () => setTodos(ts => [...ts, {id: todos.length + 1, title: "", isDone: false}]);
    const save = async (todo: Todo) => {
        setSelectedTodoId(null);
        const id = await saveTodo(todo);
        if (todo.id === id)
            return;
        setTodos(ts => [{...todo, id}, ...ts]);
    };

    return <>
        <Button startIcon={<Add/>} onClick={onAdd}>New To-do</Button>
        <List>
            {
                selectedTodoId === 0 && <>
                    <TodoEditor todo={newTodo}
                                onChange={todo => setNewTodo(todo)}
                                onDelete={() => {}}
                                onSave={async () => {
                                    await save(newTodo);
                                    setNewTodo({id: 0, title: "", isDone: false});
                                }}
                    />
                </>
            }
            {
                todos.map(todo => {
                    if (todo.id === selectedTodoId)
                        return <TodoEditor
                            key={todo.id}
                            todo={todo}
                            onChange={onModify}
                            onDelete={() => onRemove(todo.id)}
                            onSave={() => save(todo)}
                        />
                    return <TodoPreview
                        key={todo.id}
                        todo={todo}
                        onSelect={() => setSelectedTodoId(todo.id)}
                        onChecked={isChecked => {
                            onModify({...todo, isDone: isChecked})
                        }}
                    />;
                })
            }
        </List>
    </>;
}