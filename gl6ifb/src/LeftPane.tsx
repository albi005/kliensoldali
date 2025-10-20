import "./LeftPane.css"
import {useState} from "preact/hooks";
import {TextInputAndButton} from "./TextInputAndButton";

export function LeftPane()
{
    let [ invite, setInvite ] = useState( "" );
    return <div class="LeftPane">
        <TextInputAndButton value={ invite } onChange={ setInvite } buttonContent="Invite"
                            placeholder="Tag" icon="person_add" />
        <div />
    </div>
}