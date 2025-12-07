import { useState, useEffect } from "react";
import type { Todo } from "@/types.ts"
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import DateTimeSelector from "@/components/DateTimeSelector.tsx";

const getPresetDueDate = (preset: string): string | undefined => {
  if (preset === "none" || preset === "custom") {
    return undefined;
  }
  const now = new Date();
  switch (preset) {
    case "10s":
      now.setSeconds(now.getSeconds() + 10);
      break;
    case "1min":
      now.setMinutes(now.getMinutes() + 1);
      break;
    case "15min":
      now.setMinutes(now.getMinutes() + 15);
      break;
    default:
      return undefined;
  }
  return now.toISOString();
};

const DUE_DATE_PRESETS = [
  { value: "none", label: "None" },
  { value: "10s", label: "in 10s" },
  { value: "1min", label: "in 1min" },
  { value: "15min", label: "in 15min" },
  { value: "custom", label: "Custom" },
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date>(new Date());
  const [newTodoDueTime, setNewTodoDueTime] = useState("");
  const [dueDatePreset, setDueDatePreset] = useState("none");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));

    // Set up notifications for incomplete todos with due dates
    todos.forEach((todo) => {
      if (!todo.isDone && todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        const now = new Date();
        const timeUntilDue = dueDate.getTime() - now.getTime();

        if (timeUntilDue > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Reminder", {
                body: `${todo.title} is due`,
              });
            }
          }, timeUntilDue);
        }
      }
    });
  }, [todos]);

  const addTodo = () => {
    if (newTodoTitle.trim() === "") return;

    let dueDate: Date | undefined;
    if (dueDatePreset === "custom") {
      dueDate =
        newTodoDueDate && newTodoDueTime
          ? `${newTodoDueDate}T${newTodoDueTime}`
          : newTodoDueDate;
    } else {
      dueDate = getPresetDueDate(dueDatePreset);
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: newTodoTitle,
      isDone: false,
      dueDate: dueDate,
    };
    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
    setNewTodoDueDate("");
    setNewTodoDueTime("");
    setDueDatePreset("none");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <TextField
          label="New Todo"
          variant="outlined"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <FormControl>
          <InputLabel>Due</InputLabel>
          <Select
            value={dueDatePreset}
            onChange={(e) => setDueDatePreset(e.target.value)}
            label="Due"
          >
            {DUE_DATE_PRESETS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {dueDatePreset === "custom" && (
          <>
              <DateTimeSelector value={newTodoDueDate} onChange={d => setNewTodoDueDate(d)}/>
          </>
        )}
        <Button variant="contained" onClick={addTodo}>
          Add
        </Button>
      </Stack>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteTodo(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              edge="start"
              checked={todo.isDone}
              tabIndex={-1}
              disableRipple
              onChange={() => toggleTodo(todo.id)}
            />
            <ListItemText
              primary={
                <Stack direction="row" spacing={1}>
                  <span>{todo.title}</span>
                  {todo.dueDate && (
                    <span style={{ fontSize: "0.8em", color: "gray" }}>
                      (
                      {new Date(todo.dueDate).toLocaleString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hourCycle: "h23",
                      })}
                      )
                    </span>
                  )}
                </Stack>
              }
              style={{
                textDecoration: todo.isDone ? "line-through" : "none",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}