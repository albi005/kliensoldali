import LogOutButton from "@/components/LogOutButton.tsx";
import PushSubscriptionManager from "@/components/PushSubscriptionManager.tsx";
import {TodosPage} from "@/components/TodosPage.tsx";

export const LoggedIn = () => {
    return <div style={{display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", margin: "auto"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <LogOutButton/>
            <PushSubscriptionManager/>
        </div>
        <TodosPage/>
    </div>;
}