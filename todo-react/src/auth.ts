import {createCredential, registerCredential, requestRequestToken} from "./Server.ts";

export async function register() {
    const {headerName, requestToken} = await requestRequestToken();
    const headers = {[headerName]: requestToken,};
    let credential;
    credential = await createCredential(headers, undefined);
    await registerCredential(credential, headers, undefined);
}