import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function Search() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [error, setError] = useState("")
    const { token, setCurrentTrack } = useAuth()

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const trimmedQuery = query.trim()


            if (!trimmedQuery || trimmedQuery.length < 3) {
                setResults([])
                setError("")
                return
            }


            if (!token || token === "undefined" || token === "null") {
                setResults([])
                setError("Spotify token is missing or invalid. Please log in again.")
                return
            }

            try {

                const queryString = `q=${encodeURIComponent(trimmedQuery)}&type=track&limit=10`
                const res = await fetch(`https://api.spotify.com/v1/search?${queryString}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,

                    },
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    console.error("Spotify API error details:", errorData)
                    setResults([])
                    setError(`Search Error: ${errorData.error?.message || "Invalid Request"}`)
                    return
                }

                const data = await res.json()
                setResults(data.tracks?.items || [])
                setError("")

            } catch (err) {
                console.error("Network/Fetch error:", err)
                setResults([])
                setError("Network error. Please check your connection.")
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [query, token])

    return (
        <main className="flex-1 overflow-y-auto p-8 pb-32 bg-[#121212] text-white font-geist">
            <div className="sticky top-0 bg-[#121212] py-4 z-10">
                <div className="relative max-w-md mx-auto">
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        value={query}
                        placeholder="What do you want to listen to?"
                        className="w-full bg-[#242424] text-white pl-12 pr-4 py-3 rounded-full text-sm focus:outline-none border border-transparent focus:border-white/20 transition-all hover:bg-[#2a2a2a] font-inter"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="mt-10 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center max-w-md mx-auto font-inter">
                    {error}
                </div>
            )}

            {results.length > 0 ? (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 font-geist">Songs</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {results.map((track) => (
                            <div
                                key={track.id}
                                onClick={() => setCurrentTrack(track)}
                                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 group cursor-pointer shadow-md"
                            >
                                <div className="relative mb-4">
                                    <img
                                        src={track.album?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                        className="w-full aspect-square object-cover rounded-md shadow-lg"
                                        alt={track.name}
                                    />
                                    <div className="absolute bottom-2 right-2 bg-[#1DB954] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="black">
                                            <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="font-bold truncate text-sm mb-1 font-inter">{track.name}</h2>
                                <p className="text-xs text-gray-400 truncate font-inter">
                                    {track.artists?.map(a => a.name).join(", ")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                query && !error && (
                    <p className="mt-10 text-gray-400 text-center font-inter">
                        No results found for "{query}"
                    </p>
                )
            )}
        </main>
    )
}