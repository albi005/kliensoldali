import { render } from 'preact';
import './index.css';
import {Login} from "./Login";
function App()
{
    return <Login />
}
render( <App />, document.getElementById( 'app' ) );