import type {Todo} from "@/types.ts";

const baseUrl = "http://localhost:5157";

async function fetchWithErrorHandling(url: string | URL | Request, options: RequestInit = {}) {
    url = baseUrl + url;
    const response = await fetch(url, {
        credentials: 'include',
        ...options
    });
    if (!response.ok) {
        const text = await response.text();
        console.error(text);
        throw new Error(`The server responded with status ${response.status}.`);
    }
    return response;
}

export async function requestRequestToken() {
    const response = await fetchWithErrorHandling('/Account/RequestToken', {
        method: 'POST',
    });
    return await response.json() as { requestToken: string, headerName: string };
}

export async function createCredential(headers: { [x: number]: any; }, signal: any) {
    const optionsResponse = await fetchWithErrorHandling('/Account/PasskeyCreationOptions', {
        method: 'POST',
        headers,
        signal,
    });
    const optionsJson = await optionsResponse.json();
    const options = PublicKeyCredential.parseCreationOptionsFromJSON(optionsJson);
    const credential =  await navigator.credentials.create({
        publicKey: {...options, authenticatorSelection: {residentKey: "required"}},
        signal
    });
    return credential ? credential as PublicKeyCredential : null;
}

export async function registerWithPasskey(credential: PublicKeyCredential, headers: { [x: number]: any; }, signal: any) {
    await fetchWithErrorHandling('/Account/RegisterWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
        signal,
    });
}

export async function signInWithCredential(credential: PublicKeyCredential, headers: { [x: number]: any; }, signal: any) {
    const response = await fetchWithErrorHandling('/Account/SignInWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
        signal,
    });
}

export async function requestCredential(email: string | null, mediation: CredentialMediationRequirement | undefined, headers: {
    [x: number]: any;
} | undefined, signal: undefined) {
    const optionsResponse = await fetchWithErrorHandling(`/Account/PasskeyRequestOptions?username=${email}`, {
        method: 'POST',
        headers,
        signal,
    });
    const optionsJson = await optionsResponse.json();
    const options = PublicKeyCredential.parseRequestOptionsFromJSON(optionsJson);
    const credential = await navigator.credentials.get({publicKey: options, mediation, signal});
    return credential ? credential as PublicKeyCredential : null;
}

export async function requestEndpoints() {
    const response = await fetchWithErrorHandling('/api/push-subscriptions/endpoints');
    return (await response.json()) as string[];
}

export async function subscribeToPush(endpoint: PushSubscription) {
    await fetchWithErrorHandling('/api/push-subscriptions', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(endpoint)
    });
}

export async function unsubscribeFromPush(endpoint: string) {
    await fetchWithErrorHandling(`/api/push-subscriptions/${encodeURIComponent(endpoint)}`, {method: 'DELETE'});
}

export async function requestVapidPublicKey() {
    const response = await fetchWithErrorHandling('/api/push-subscriptions/public-key');
    if (response.ok) {
        let applicationServerPublicKeyBase64 = await response.text();
        return urlB64ToUint8Array(applicationServerPublicKeyBase64);
    } else {
        return Promise.reject(response.status + ' ' + response.statusText);
    }
}

function urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export async function requestTodos(): Promise<Todo[]> {
    const response = await fetchWithErrorHandling('/api/todos');
    return await response.json();
}

export const server = new class Server {
    /**
     * Returns the user's ID, or an empty string if the user is not logged in.
     * */
    async me(): Promise<"" | string> {
        const response = await fetch(`${baseUrl}/api/me`, {credentials: "include"});
        return await response.text();
    }

    async logOut(): Promise<void> {
        await fetch(`${baseUrl}/api/logout`, {
            method: "POST",
            credentials: "include"
        });
    }
}