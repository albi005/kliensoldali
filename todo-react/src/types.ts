export type Todo = {
  id: number;
  title: string;
  isDone: boolean;
  dueDate?: string; // Optional due date in ISO string format
};
