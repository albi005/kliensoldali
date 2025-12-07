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
    return await navigator.credentials.create({
        publicKey: {...options, authenticatorSelection: {residentKey: "required"}},
        signal
    });
}

export async function registerCredential(credential: PublicKeyCredential, headers: { [x: number]: any; }, signal: any) {
    const response = await fetchWithErrorHandling('/Account/RegisterWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
        signal,
    });
    console.log(response);
    const json = await response.json();
    console.log(json);
}

export async function signInWithCredential(credential: PublicKeyCredential, headers: { [x: number]: any; }, signal: any) {
    const response = await fetchWithErrorHandling('/Account/SignInWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
        signal,
    });
    console.log(response);
}

export async function requestCredential(email: string | null, mediation: string | undefined, headers: {
    [x: number]: any;
} | undefined, signal: undefined) {
    const optionsResponse = await fetchWithErrorHandling(`/Account/PasskeyRequestOptions?username=${email}`, {
        method: 'POST',
        headers,
        signal,
    });
    const optionsJson = await optionsResponse.json();
    const options = PublicKeyCredential.parseRequestOptionsFromJSON(optionsJson);
    return await navigator.credentials.get({publicKey: options, mediation, signal});
}


export const server = new class Server {
    /**
     * Returns the user's ID, or an empty string if the user is not logged in.
     * */
    async me(): Promise<"" | string> {
        const response = await fetch(`${baseUrl}/api/me`, {credentials: "include"});
        return await response.text();
    }

    async logout(): Promise<void> {
        await fetch(`${baseUrl}/api/logout`, {
            method: "POST",
            credentials: "include"
        });
    }
}