import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const [profile, setProfile] = useState(null)
    const [recent, setRecentlyPlayed] = useState([])
    const [artist, setArtist] = useState([])
    const { token, setToken, playlists, setCurrentTrack, setPlaylists } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return
        fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) return null
                return res.json()
            })
            .then(data => { if (data) setProfile(data) })
    }, [token])

    useEffect(() => {
        if (!token) return
        fetch('https://api.spotify.com/v1/me/player/recently-played', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) return null
                return res.json()
            })
            .then(data => { if (data?.items) setRecentlyPlayed(data.items) })
    }, [token])

    useEffect(() => {
        if (!token) return
        fetch('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) return null
                return res.json()
            })
            .then(data => { if (data?.items) setArtist(data.items) })
    }, [token])

    function Time() {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        setToken(null)
        setPlaylists([])
        navigate('/')
    }

    return (
        <div className="flex-1 bg-[#121212] text-white">
            <main className="p-8">
                {profile && (
                    <div className="flex items-center justify-between mt-4">
                        <h1 className="font-[Geist] text-3xl font-bold">
                            {Time()}, {profile.display_name}
                        </h1>
                        <div className="flex items-center gap-3">
                            {profile.images?.[0]?.url && (
                                <img
                                    src={profile.images[0].url}
                                    className="w-10 h-10 rounded-full object-cover"
                                    alt={profile.display_name}
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )}

                <h1 className="font-[Geist] text-2xl font-bold mt-10">Jump back in</h1>
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {playlists.slice(0, 8).map(playlist => (
                        <div
                            key={playlist.id}
                            onClick={() => navigate(`/playlist/${playlist.id}`)}
                            className="bg-[#323435] h-16 flex items-center rounded-lg hover:bg-[#282828] transition cursor-pointer"
                        >
                            <img src={playlist?.images?.[0]?.url} className="w-16 h-16 object-cover rounded-l-lg" />
                            <p className="truncate font-[Geist] font-bold w-full text-left ml-5">{playlist.name}</p>
                        </div>
                    ))}
                </div>

                <h1 className="font-[Geist] text-2xl font-bold mt-10">Recently Played</h1>
                <div className="grid grid-cols-7 gap-4 mt-6">
                    {recent.slice(0, 7).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentTrack(item.track)}
                            className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition group cursor-pointer"
                        >
                            <div className="relative">
                                <img
                                    src={item.track.album.images[0].url}
                                    className="w-full aspect-square object-cover rounded-md shadow-lg"
                                    alt={item.track.name}
                                />
                                <div className="absolute bottom-2 right-2 bg-[#1DB954] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="black">
                                        <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col mt-3">
                                <span className="text-sm font-bold truncate">{item.track.name}</span>
                                <span className="text-xs text-gray-400 truncate">{item.track.artists[0].name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <h1 className="font-[Geist] text-2xl font-bold mt-10">Your Top Artists</h1>
                <div className="grid grid-cols-7 mb-5 gap-4 mt-6">
                    {artist.slice(0, 7).map(a => (
                        <div key={a.id} className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                            <img src={a.images[0].url} className="w-full aspect-square object-cover rounded-full" />
                            <div className="flex flex-col mt-2">
                                <span className="text-sm font-bold truncate">{a.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}