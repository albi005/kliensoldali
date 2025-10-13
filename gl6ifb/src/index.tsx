import {render} from 'preact';
import './index.css';
import {Login} from "./Login";

if (localStorage["theme"]) {
    document.documentElement.classList.add("theme-light");
}


function App() {
    return <Login/>
}

render(<App/>, document.getElementById('app'));