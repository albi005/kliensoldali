import "./index.css";

import {Slop} from "./Slop";
import {CssBaseline} from "@mui/material";

export function App() {
    return (
        <>
            <CssBaseline />
            <div className="app">
                <h1>TodoReact</h1>
                <Slop/>
            </div>
        </>
    );
}

export default App;
