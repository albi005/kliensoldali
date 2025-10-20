import {RightPane} from "./RightPane";
import {LeftPane} from "./LeftPane";
import "./Main.css"

export function Main()
{
    return <div class="Main">
        <LeftPane />
        <RightPane />
    </div>
}