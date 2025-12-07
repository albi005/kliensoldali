import "./index.css";
import {Login} from "./Login";

import {TodoList} from "./TodoList";
import {CssBaseline, Button} from "@mui/material";
import {useState, useEffect} from "react";
import {server} from "./Server";

export function App() {
    const [userId, setUserId] = useState<"" | string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        server.me().then(setUserId);
    }, [refreshTrigger]);

    const handleLogout = async () => {
        localStorage.clear();
        await server.logout();
        setUserId("");
    };

    if (userId === null) {
        return <>
            <CssBaseline/>
            <h1>Loading...</h1>
        </>;
    }

    return (
        <>
            <CssBaseline/>

            {userId !== "" && (
                <>
                    <h1>Welcome, {userId}!</h1>
                    <Button onClick={handleLogout} variant="contained" sx={{m: 2}}>
                        Log Out
                    </Button>
                </>
            )}
            {userId !== ""
                ? <TodoList/>
                : <Login onLoginSuccess={() => setRefreshTrigger(prev => prev + 1)}/>
            }
        </>
    );
}
