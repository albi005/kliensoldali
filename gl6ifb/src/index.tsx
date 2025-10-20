import {render} from 'preact';
import './index.css';
import {Main} from "./Main";
import {useState} from "preact/hooks";
import {chatService} from "./ChatService";
import {useEffect} from "preact/hooks";
import {Login} from "./Login";

if (localStorage["theme"]) {
    document.documentElement.classList.add("theme-light");
}

function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    useEffect(
        () => {
            const listener = () => setLoggedIn(!!chatService.inbox);
            chatService.addListener(listener);
            return () => chatService.removeListener(listener);
        },
        []
    );

    return loggedIn ? <Main/> : <Login/>
}

render(<App/>, document.getElementById('app'));