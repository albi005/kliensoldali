import LogOutButton from "@/components/LogOutButton.tsx";
import PushSubscriptionManager from "@/components/PushSubscriptionManager.tsx";
import {TodosPage} from "@/components/TodosPage.tsx";
import AddPasskeyButton from "@/components/AddPasskeyButton.tsx";

export const LoggedIn = () => {
    return <div style={{display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", margin: "auto"}}>
        <div style={{display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "1rem"}}>
            <LogOutButton/>
            <AddPasskeyButton/>
            <PushSubscriptionManager/>
        </div>
        <TodosPage/>
    </div>;
}