import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Library() {
    const { playlists } = useAuth()

    return (
        <main className="flex-1 p-8 pb-32 overflow-y-auto bg-[#121212] text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-[Geist]">Your Library</h1>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                <Link
                    to="/library/liked-songs"
                    className="bg-linear-to-br from-[#450af5] to-[#c4efd9] p-5 rounded-lg flex flex-col justify-end relative group cursor-pointer min-h-50"
                >
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Liked Songs</h2>
                        <p className="mt-1 text-sm text-white/80">Your saved tracks</p>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-[#1DB954] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="black">
                            <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path>
                        </svg>
                    </div>
                </Link>

                {playlists?.map((playlist) => (
                    <Link
                        key={playlist.id}
                        to={`/playlist/${playlist.id}`}
                        className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition group cursor-pointer block"
                    >
                        <div className="relative mb-4">
                            <img
                                src={playlist?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                className="w-full aspect-square object-cover rounded-md shadow-lg"
                                alt={playlist.name}
                            />
                            <div className="absolute bottom-2 right-2 bg-[#1DB954] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="black">
                                    <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path>
                                </svg>
                            </div>
                        </div>
                        <h2 className="font-bold truncate text-sm mb-1">{playlist.name}</h2>
                        <p className="text-xs text-gray-400">By {playlist.owner?.display_name || "Spotify User"}</p>
                    </Link>
                ))}
            </div>
        </main>
    )
}