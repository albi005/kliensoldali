import "./LeftPane.css"
import {useState} from "preact/hooks";
import {TextInputAndButton} from "./TextInputAndButton";
import {chatService, ConversationDto} from "./ChatService";
import {ConversationCard} from "./ConversationCard";

export type LeftPaneProps = {
    selected?: ConversationDto
    onSelect: (conversationDto: ConversationDto) => void;
}

export function LeftPane({selected, onSelect}: LeftPaneProps) {
    let [invite, setInvite] = useState("");
    return <div class="LeftPane">
        <p>My tag: {chatService.inbox.user.tag}</p>
        <TextInputAndButton value={invite} onChange={setInvite} buttonContent="Invite"
                            placeholder="Tag" icon="person_add"
                            onClick={() => {
                                if (invite) {
                                    setInvite("");
                                    chatService.send({type: "contactRequest", email: invite, firstMessage: "Hello"});
                                }
                            }}/>
        <div className="conversations">
            {chatService.inbox.conversations.map(x =>
                <ConversationCard
                    key={x.channelId} conversation={x}
                    selected={x === selected} onSelect={() => onSelect(x)}/>
            )}
        </div>
    </div>
}