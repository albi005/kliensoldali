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
    let [renderCount, setRenderCount] = useState(1);
    console.log("App render count: " + renderCount);
    useEffect(() => {
        const listener = () => setRenderCount(x => x + 1);
        chatService.addListener(listener);
        return () => chatService.removeListener(listener);
    }, []);
    return chatService.inbox ? <Main/> : <Login/>
}

render(<App/>, document.getElementById('app'));