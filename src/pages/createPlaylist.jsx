import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function CreatePlaylistForm() {
    const { createPlaylist, playlists } = useAuth();
    const [playlistName, setPlaylistName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!playlistName.trim()) return;

        setLoading(true);
        const result = await createPlaylist(playlistName);
        setLoading(false);

        if (result) {
            setPlaylistName("");
        }
    };

    return (
        <div className="max-w-md mx-auto">

            <form
                onSubmit={handleCreate}
                className="bg-[#121212] p-6 rounded-lg border border-white/10 mb-6"
            >
                <h2 className="text-white text-xl font-bold mb-4 font-geist">
                    Create New Playlist
                </h2>
                <div className="flex flex-col gap-y-4">
                    <input
                        type="text"
                        placeholder="Give your playlist a name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="bg-[#2a2a2a] text-white p-3 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-inter"
                    />
                    <button
                        type="submit"
                        disabled={loading || !playlistName.trim()}
                        className={`bg-[#1ed760] text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 font-inter`}
                    >
                        {loading ? 'Creating...' : 'Create Playlist'}
                    </button>
                </div>
            </form>


            <div>
                <h3 className="text-white text-lg font-semibold mb-2 font-geist">
                    Your Playlists
                </h3>
                <ul className="flex flex-col gap-y-2">
                    {playlists.length === 0 && (
                        <li className="text-white/60">No playlists yet</li>
                    )}
                    {playlists.map((pl) => (
                        <li
                            key={pl.id}
                            className="bg-[#2a2a2a] text-white p-3 rounded-md border border-white/10 font-inter"
                        >
                            {pl.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}