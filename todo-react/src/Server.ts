import type {Todo} from "@/types.ts";

const baseUrl = "https://todo-api.alb1.hu";

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

export async function createCredential(headers: { [x: number]: any; }) {
    const optionsResponse = await fetchWithErrorHandling('/Account/PasskeyCreationOptions', {
        method: 'POST',
        headers,
    });
    const optionsJson = await optionsResponse.json();
    const options = PublicKeyCredential.parseCreationOptionsFromJSON(optionsJson);
    const credential =  await navigator.credentials.create({
        publicKey: {...options, authenticatorSelection: {residentKey: "required"}}
    });
    return credential ? credential as PublicKeyCredential : null;
}

/**
 * Register a new user using the given Passkey
 * @param credential the Passkey
 * @param headers additional headers to add to the request
 */
export async function registerWithPasskey(credential: PublicKeyCredential, headers: { [x: number]: any; }) {
    await fetchWithErrorHandling('/Account/RegisterWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
    });
}

/**
 * Add a new Passkey to the current user
 * @param credential the Passkey to add
 * @param headers additional headers to add to the request
 */
export async function addPasskey(credential: PublicKeyCredential, headers: { [x: number]: any; }) {
    await fetchWithErrorHandling('/Account/AddPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
    });
}

/**
 * Sign in the user using the given Passkey
 * @param credential the Passkey
 * @param headers additional headers to add to the request
 */
export async function signInWithCredential(credential: PublicKeyCredential, headers: { [x: number]: any; }) {
    await fetchWithErrorHandling('/Account/SignInWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
    });
}

/**
 * Requests a Passkey request from the server, then asks the user to sign in using a Passkey
 * @param mediation whether the user should be asked to participate in the operation
 * @param headers additional headers to add to the request
 * @returns the credential if successful, null otherwise
 */
export async function requestCredential(
    mediation: CredentialMediationRequirement | undefined,
    headers: { [x: number]: any; } | undefined
): Promise<PublicKeyCredential | null> {
    const optionsResponse = await fetchWithErrorHandling(`/Account/PasskeyRequestOptions`, {
        method: 'POST',
        headers,
    });
    const optionsJson = await optionsResponse.json();
    const options = PublicKeyCredential.parseRequestOptionsFromJSON(optionsJson);
    const credential = await navigator.credentials.get({publicKey: options, mediation });
    return credential ? credential as PublicKeyCredential : null;
}

/**
 * Requests the user's currently registered push subscription endpoints.
 * @returns a list of endpoints
 */
export async function requestEndpoints(): Promise<string[]> {
    const response = await fetchWithErrorHandling('/api/push-subscriptions/endpoints');
    return (await response.json()) as string[];
}

/**
 * Subscribes the user to push notifications using the given endpoint.
 * @param endpoint the endpoint to subscribe with
 */
export async function subscribeToPush(endpoint: PushSubscription) {
    await fetchWithErrorHandling('/api/push-subscriptions', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(endpoint)
    });
}

/**
 * Unsubscribes the user from push notifications using the given endpoint.
 * @param endpoint the endpoint to unsubscribe from
 */
export async function unsubscribeFromPush(endpoint: string) {
    await fetchWithErrorHandling(`/api/push-subscriptions/${encodeURIComponent(endpoint)}`, {method: 'DELETE'});
}

/**
 * Requests the VAPID public key from the server.
 * @returns the public key as a Uint8Array
 */
export async function requestVapidPublicKey(): Promise<Uint8Array<ArrayBuffer>> {
    const response = await fetchWithErrorHandling('/api/push-subscriptions/public-key');
    if (response.ok) {
        let applicationServerPublicKeyBase64 = await response.text();
        return urlB64ToUint8Array(applicationServerPublicKeyBase64);
    } else {
        return Promise.reject(response.status + ' ' + response.statusText);
    }
}

/**
 * Converts a base64 string to a Uint8Array.
 * @param base64String the base64 string to convert
 * @returns the converted Uint8Array
 */
function urlB64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

/**
 * Requests the user's todos from the server.
 * @returns a list of todos
 */
export async function requestTodos(): Promise<Todo[]> {
    const response = await fetchWithErrorHandling('/api/todos');
    return await response.json();
}


/**
 * Saves a To-do on the server
 * @param todo the To-do
 * @returns the to-do's ID
 */
export async function saveTodo(todo: Todo): Promise<number> {
    const response = await fetchWithErrorHandling('/api/todos', {
        method: "PUT",
        body: JSON.stringify(todo),
        headers: {'Content-Type': 'application/json'}
    });
    return (await response.json()) as number;
}

export const server = new class Server {
    /**
     * @returns the user's ID, or an empty string if the user is not logged in.
     * */
    async me(): Promise<"" | string> {
        const response = await fetch(`${baseUrl}/api/me`, {credentials: "include"});
        return await response.text();
    }

    /**
     * Asks the server to log the user out, clearing the cookies used for authentication.
     */
    async logOut(): Promise<void> {
        await fetch(`${baseUrl}/api/logout`, {
            method: "POST",
            credentials: "include"
        });
    }
}
