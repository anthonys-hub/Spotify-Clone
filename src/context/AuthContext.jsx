import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const spotifyFetch = async (url, token, options = {}) => {
    if (!token || token === "undefined" || token === "null") return null;

    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 401 || res.status === 429) return null;

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Spotify API Error:", errorData);
            return null;
        }

        return await res.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
};

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        const saved = localStorage.getItem('access_token');
        return (saved === "undefined" || saved === "null") ? null : saved;
    });

    const [playlists, setPlaylists] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!token) return;

        spotifyFetch('https://api.spotify.com/v1/me/playlists?limit=50', token)
            .then(data => {
                if (data?.items) setPlaylists(data.items);
            });
    }, [token]);

    const createPlaylist = async (customName) => {
        if (!token) return null;

        const name = String(customName || "").trim();
        if (!name) return null;

        try {
            const newPlaylist = await spotifyFetch(
                'https://api.spotify.com/v1/me/playlists',
                token,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        description: "Created w/ Anthony's Spotify Clone!",
                        public: false,
                    }),
                }
            );

            if (newPlaylist?.id) {
                setPlaylists(prev => [newPlaylist, ...prev]);
                return newPlaylist;
            } else {
                return null;
            }
        } catch (err) {
            console.error("Create playlist error:", err);
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                playlists,
                setPlaylists,
                currentTrack,
                setCurrentTrack,
                isPlaying,
                setIsPlaying,
                createPlaylist,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}