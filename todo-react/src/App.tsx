import "./index.css";

import {TodoList} from "./TodoList";
import {CssBaseline} from "@mui/material";

export function App() {
    return (
        <>
            <CssBaseline />
            <div className="app">
                <h1>TodoReact</h1>
                <TodoList/>
            </div>
        </>
    );
}

export default App;
