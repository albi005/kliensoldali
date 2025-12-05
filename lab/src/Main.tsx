import {RightPane} from "./RightPane";
import {LeftPane} from "./LeftPane";
import "./Main.css"
import {useState} from "preact/hooks";
import {ConversationDto} from "./ChatService";

export function Main() {
    let [selected, setSelected] = useState<ConversationDto>();
    return <div className={`Main ${selected ? "right" : "left"}`}>
        <LeftPane selected={selected} onSelect={setSelected}/>
        <RightPane conversation={selected} onBack={() => setSelected(undefined)}/>
    </div>
}