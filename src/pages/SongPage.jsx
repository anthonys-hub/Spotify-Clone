import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TrackPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const [track, setTrack] = useState(null);

    useEffect(() => {
        if (!token) return;

        fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTrack(data))
            .catch(err => console.error(err));
    }, [id, token]);

    if (!track) return <div className="text-white p-8">Loading track...</div>;

    return (
        <div className="bg-[#121212] min-h-screen text-white p-8">
            <h1 className="text-3xl font-bold">{track.name}</h1>
            <p className="text-gray-400 mt-2">
                By {track.artists.map(a => a.name).join(", ")}
            </p>
            <p className="text-gray-400 mt-1">Album: {track.album.name}</p>
            <img src={track.album.images[0]?.url} alt={track.name} className="w-64 mt-4" />
        </div>
    );
}