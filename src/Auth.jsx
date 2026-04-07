export async function redirectToSpotifyLogin() {
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], '');
    };

    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    };

    const base64encode = (input) => {
        const bytes = new Uint8Array(input);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    localStorage.setItem('code_verifier', codeVerifier);

    const params = {
        response_type: 'code',
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: 'playlist-modify-public playlist-modify-private playlist-read-private user-read-private user-read-email streaming user-library-read user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read user-read-currently-playing user-follow-read',
        show_dialog: true,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    };

    const url = new URL('https://accounts.spotify.com/authorize');
    url.search = new URLSearchParams(params).toString();

    window.location.href = url.toString();
}