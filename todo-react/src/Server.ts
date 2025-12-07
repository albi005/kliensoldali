const baseUrl = "http://localhost:5157";

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