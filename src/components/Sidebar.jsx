import { AiOutlineSpotify } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { LuLibrary } from "react-icons/lu";
import { BsPlusSquareFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { playlists, createPlaylist } = useAuth();
    const navigate = useNavigate();


    const [creating, setCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateClick = () => setCreating(true);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        setLoading(true);
        const result = await createPlaylist(newPlaylistName);
        setLoading(false);

        if (result) {
            setNewPlaylistName("");
            setCreating(false);
        }
    };

    return (
        <div className="w-64 h-screen bg-black flex flex-col p-6 gap-6 shrink-0 sticky top-0">
            <div className="flex items-center gap-2">
                <AiOutlineSpotify size={28} className="text-white" />
                <span className="font-bold text-xl text-white font-[Geist]">Spotify</span>
            </div>

            <div className="flex flex-col gap-4">
                <Link to='/dashboard' className="flex items-center gap-3 cursor-pointer hover:text-white text-white/70 transition-colors">
                    <IoHomeOutline size={22} /> Home
                </Link>

                <Link to='/search' className="flex items-center gap-3 cursor-pointer hover:text-white text-white/70 transition-colors">
                    <CiSearch size={22} /> Search
                </Link>

                <Link to="/library" className="flex items-center gap-3 cursor-pointer hover:text-white text-white/70 transition-colors">
                    <LuLibrary size={22} /> Your Library
                </Link>

                <p className="text-[12px] font-bold mt-5 text-[#B3B3B3] tracking-widest">PLAYLISTS</p>


                <div className="flex flex-col gap-2">
                    {!creating && (
                        <p
                            onClick={handleCreateClick}
                            className="flex items-center gap-3 cursor-pointer hover:text-white text-white/70 transition-colors"
                        >
                            <BsPlusSquareFill size={22} /> Create Playlist
                        </p>
                    )}

                    {creating && (
                        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Enter playlist name"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="bg-[#2a2a2a] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading || !newPlaylistName.trim()}
                                    className="bg-[#1ed760] text-black font-bold py-2 px-4 rounded hover:scale-105 transition disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCreating(false); setNewPlaylistName(""); }}
                                    className="bg-[#282828] text-white py-2 px-4 rounded hover:scale-105 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <Link to="/library/liked-songs" className="flex items-center gap-3 cursor-pointer hover:text-white text-white/70 transition-colors">
                    <FaHeart size={22} /> Liked Songs
                </Link>

                <hr className="border-gray-800" />

                <div className="overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                    {playlists?.map((playlist) => (
                        <p
                            key={playlist.id}
                            onClick={() => navigate(`/playlist/${playlist.id}`)}
                            className="cursor-pointer hover:text-white text-white/70 text-sm truncate transition-colors"
                        >
                            {playlist.name}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}