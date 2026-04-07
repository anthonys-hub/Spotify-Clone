import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function LikedSongs() {
    const [savedTracks, setSavedTracks] = useState(null)
    const { token, setCurrentTrack } = useAuth()

    useEffect(() => {
        if (!token) return
        fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setSavedTracks(data))
    }, [token])

    if (!savedTracks) return <div className="bg-[#121212] min-h-screen text-white p-8">Loading Liked Songs...</div>

    const trackItems = savedTracks.items || []

    return (
        <main className="flex-1 overflow-y-auto pb-32 bg-[#121212] text-white font-[Geist]">
            <div className="bg-linear-to-b from-[#5038a0] to-[#121212] p-8 pt-20 flex items-end gap-6">
                <div className="w-52 h-52 bg-linear-to-br from-[#450af5] to-[#c4efd9] shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-sm flex items-center justify-center">
                    <svg role="img" height="80" width="80" viewBox="0 0 24 24" fill="white">
                        <path d="M15.724 4.22a4.313 4.313 0 00-5.619.64L9.07 5.92a.5.5 0 01-.707 0L7.328 4.86a4.313 4.313 0 00-5.62-.64 4.41 4.41 0 00-1.077 6.13l7.98 9.39a.5.5 0 00.757 0l7.981-9.39a4.41 4.41 0 00-1.625-6.13z"></path>
                    </svg>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider">Playlist</p>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter">Liked Songs</h1>
                    <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                        <span className="font-bold">Your Library</span>
                        <span className="text-gray-400">•</span>
                        <span>{savedTracks.total || 0} songs</span>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 text-gray-400 border-b border-white/10 mb-4 text-xs font-semibold uppercase tracking-widest">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span className="text-right pr-4">Duration</span>
                </div>

                <div className="flex flex-col gap-1">
                    {trackItems.map((item, index) => {
                        const track = item.track
                        if (!track) return null
                        return (
                            <div
                                key={`${track.id}-${index}`}
                                onClick={() => setCurrentTrack(track)}
                                className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 hover:bg-white/10 rounded-md group items-center text-sm transition-colors cursor-pointer"
                            >
                                <span className="text-gray-400 group-hover:text-white tabular-nums">{index + 1}</span>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={track.album?.images?.[0]?.url} className="w-10 h-10 rounded shadow-md" alt="" />
                                    <div className="flex flex-col truncate">
                                        <p className="text-white font-medium truncate">{track.name}</p>
                                        <p className="text-gray-400 text-xs group-hover:text-white truncate">{track.artists?.map(a => a.name).join(", ")}</p>
                                    </div>
                                </div>
                                <span className="text-gray-400 truncate group-hover:text-white">{track.album?.name}</span>
                                <span className="text-gray-400 text-right pr-4 tabular-nums">
                                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}