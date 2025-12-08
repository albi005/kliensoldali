import {useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import {requestEndpoints, requestVapidPublicKey, subscribeToPush, unsubscribeFromPush} from "@/Server.ts";
import NotificationsOff from "@mui/icons-material/NotificationsOff";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import CircularProgress from "@mui/material/CircularProgress";

function getServiceWorker(): Promise<ServiceWorkerRegistration> {
    return serviceWorkerCache
        ??= navigator.serviceWorker
        .register('sw.js')
        .then(async sw => {
            await sw.update();
            return sw;
        });
}

let serviceWorkerCache: Promise<ServiceWorkerRegistration>;

function getVapidPublicKey(): Promise<BufferSource> {
    return vapidPublicKeyCache ??= requestVapidPublicKey();
}

let vapidPublicKeyCache: Promise<BufferSource>;


/**
 * Handles subscribing to and unsubscribing from push notifications.
 * Renders an icon button that when clicked, toggles between the two states.
 */
export default function PushSubscriptionManager() {
    const [endpoints, setEndpoints] = useState<string[]>([]);
    const [endpoint, setEndpoint] = useState<string | null>(null);
    const [busyCount, setBusyCount] = useState(0);

    function runAsync(fn: () => Promise<void>) {
        setBusyCount(busyCount => busyCount + 1);
        fn().finally(() => setBusyCount(busyCount => busyCount - 1));
    }

    useEffect(() => {
        runAsync(async () => {
            const endpoints = await requestEndpoints();
            setEndpoints(endpoints);
        });
    }, []);

    useEffect(() => {
        runAsync(async () => {
            const reg = await navigator.serviceWorker.getRegistration("sw.js");
            if (!reg) return;
            const sub = await reg.pushManager.getSubscription();
            if (!sub) return;
            setEndpoint(sub.endpoint);
        });
    }, []);

    const subscribe = async () => {
        runAsync(async () => {
            const sw = await getServiceWorker();
            const publicKey = await getVapidPublicKey();
            const subscription = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey
            });
            await subscribeToPush(subscription);
            setEndpoint(subscription.endpoint);
            setEndpoints(endpoints => [
                ...endpoints,
                subscription.endpoint
            ]);
        });
    };

    const unsubscribe = () => {
        if (!endpoint) return;
        runAsync(async () => {
            await unsubscribeFromPush(endpoint);
            setEndpoint(null);
            setEndpoints(endpoints => endpoints.filter(e => e !== endpoint));
        });
    }

    const isSubscribed = !!endpoint && endpoints.includes(endpoint);

    return <div
        style={{display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", width: "48px"}}>
        {
            busyCount > 0
                ? <CircularProgress size="24px"/>
                : <IconButton onClick={isSubscribed ? unsubscribe : subscribe} color={isSubscribed ? "success" : "error"}>
                    {isSubscribed
                        ? <NotificationsActive/>
                        : <NotificationsOff/>
                    }
                </IconButton>
        }
    </div>;
}