import {Button} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import PersonAdd from '@mui/icons-material/PersonAdd';

async function fetchWithErrorHandling(url: string | URL | Request, options: RequestInit = {}) {
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

async function requestRequestToken() {
    const response = await fetchWithErrorHandling('http://localhost:5157/Account/RequestToken', {
        method: 'POST',
    });
    return await response.json() as { requestToken: string, headerName: string };
}

async function createCredential(headers: { [x: number]: any; }, signal: any) {
    const optionsResponse = await fetchWithErrorHandling('http://localhost:5157/Account/PasskeyCreationOptions', {
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

async function registerCredential(credential, headers: { [x: number]: any; }, signal: any) {
    const response = await fetchWithErrorHandling('http://localhost:5157/Account/RegisterWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
        signal,
    });
    console.log(response);
    const json = await response.json();
    console.log(json);
}

async function signInWithCredential(credential, headers: { [x: number]: any; }, signal: any) {
    const response = await fetchWithErrorHandling('http://localhost:5157/Account/SignInWithPasskey', {
        method: 'POST',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify(JSON.stringify(credential)),
        signal,
    });
    console.log(response);
}

async function requestCredential(email: string | null, mediation: string | undefined, headers: {
    [x: number]: any;
} | undefined, signal: undefined) {
    const optionsResponse = await fetchWithErrorHandling(`http://localhost:5157/Account/PasskeyRequestOptions?username=${email}`, {
        method: 'POST',
        headers,
        signal,
    });
    const optionsJson = await optionsResponse.json();
    const options = PublicKeyCredential.parseRequestOptionsFromJSON(optionsJson);
    return await navigator.credentials.get({publicKey: options, mediation, signal});
}

customElements.define('passkey-submit', class extends HTMLElement {
    connectedCallback() {
        this.internals = this.attachInternals();
        this.attrs = {
            operation: this.getAttribute('operation'),
            name: this.getAttribute('name'),
            emailName: this.getAttribute('email-name'),
            requestTokenName: this.getAttribute('request-token-name'),
            requestTokenValue: this.getAttribute('request-token-value'),
        };

        this.internals.form.addEventListener('submit', (event) => {
            if (event.submitter?.name === '__passkeySubmit') {
                event.preventDefault();
                this.obtainAndSubmitCredential().then();
            }
        });

        this.tryAutofillPasskey().then();
    }

    async obtainCredential(useConditionalMediation, signal) {
        const headers = {
            [this.attrs.requestTokenName]: this.attrs.requestTokenValue,
        };

        if (this.attrs.operation === 'Create') {
            return await createCredential(headers, signal);
        } else if (this.attrs.operation === 'Request') {
            const email = new FormData(this.internals.form).get(this.attrs.emailName);
            const mediation = useConditionalMediation ? 'conditional' : undefined;
            return await requestCredential(email, mediation, headers, signal);
        } else {
            throw new Error(`Unknown passkey operation '${this.attrs.operation}'.`);
        }
    }

    async obtainAndSubmitCredential(useConditionalMediation = false) {
        const formData = new FormData();
        try {
            const credential = await this.obtainCredential(useConditionalMediation, signal);
            const credentialJson = JSON.stringify(credential);
            formData.append(`${this.attrs.name}.CredentialJson`, credentialJson);
        } catch (error) {
            if (error.name === 'AbortError') {
                // The user explicitly canceled the operation - return without error.
                return;
            }
            console.error(error);
            if (useConditionalMediation) {
                // An error occurred during conditional mediation, which is not user-initiated.
                // We log the error in the console but do not relay it to the user.
                return;
            }
            const errorMessage = error.name === 'NotAllowedError'
                ? 'No passkey was provided by the authenticator.'
                : error.message;
            formData.append(`${this.attrs.name}.Error`, errorMessage);
        }
        this.internals.setFormValue(formData);
        this.internals.form.submit();
    }
    e
    async tryAutofillPasskey() {
        if (this.attrs.operation === 'Request' && await PublicKeyCredential.isConditionalMediationAvailable?.()) {
            await this.obtainAndSubmitCredential(/* useConditionalMediation */ true);
        }
    }
});

export function Login({onLoginSuccess}: {onLoginSuccess: () => void}) {
    return <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
            <Button startIcon={<LoginIcon/>} variant="contained" onClick={async () => {
                const {headerName, requestToken} = await requestRequestToken();
                const headers = {[headerName]: requestToken,};
                let credential;
                try {
                    credential = await requestCredential(null, "optional", headers, undefined);
                    await signInWithCredential(credential, headers, undefined);
                    onLoginSuccess();
                }
                catch (e) {
                }
            }}>
                Enter
            </Button>
            <Button startIcon={<PersonAdd/>} variant="contained" onClick={async () => {
                const {headerName, requestToken} = await requestRequestToken();
                const headers = {[headerName]: requestToken,};
                let credential;
                try {
                    credential = await createCredential(headers, undefined);
                    await registerCredential(credential, headers, undefined);
                    onLoginSuccess();
                }
                catch (e) {
                }

                console.log(credential);
            }}>
                Register
            </Button>
        </div>
    </>
}