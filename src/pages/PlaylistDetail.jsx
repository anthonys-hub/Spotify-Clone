import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PlaylistDetail() {
    const { id } = useParams()
    const { token, setCurrentTrack } = useAuth()
    const [playlist, setPlaylist] = useState(null)

    useEffect(() => {
        if (!id || !token) return

        fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPlaylist(data))
            .catch(err => console.error(err))
    }, [id, token])

    if (!playlist) return <div className="bg-[#121212] min-h-screen text-white p-8">Loading...</div>

    const trackItems = playlist.items?.items || playlist.tracks?.items || []

    return (
        <main className="flex-1 overflow-y-auto pb-32 bg-[#121212] text-white font-[Geist]">
            <div className="bg-linear-to-b from-[#535353] to-[#121212] p-8 pt-20 flex items-end gap-6">
                <img
                    src={playlist.images?.[0]?.url || 'https://via.placeholder.com/200'}
                    className="w-52 h-52 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-sm"
                    alt={playlist.name}
                />
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase">Playlist</p>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">{playlist.name}</h1>
                    <p className="text-sm text-gray-300 mt-4">
                        {playlist.owner?.display_name} • {playlist.tracks?.total || 0} songs
                    </p>
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
                    {trackItems.map((wrappedItem, index) => {
                        const track = wrappedItem.item || wrappedItem.track
                        if (!track) return null

                        return (
                            <div
                                key={`${track.id}-${index}`}
                                onClick={() => setCurrentTrack(track)}
                                className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 hover:bg-white/10 rounded-md group items-center text-sm transition-colors cursor-pointer"
                            >
                                <span className="text-gray-400 group-hover:text-white">{index + 1}</span>
                                <div className="flex items-center gap-3">
                                    <img src={track.album?.images?.[0]?.url} className="w-10 h-10 rounded shadow-md" alt="" />
                                    <div className="flex flex-col truncate">
                                        <p className="text-white font-medium truncate">{track.name}</p>
                                        <p className="text-gray-400 text-xs group-hover:text-white">
                                            {track.artists?.map(a => a.name).join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-gray-400 truncate">{track.album?.name}</span>
                                <span className="text-gray-400 text-right pr-4">
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