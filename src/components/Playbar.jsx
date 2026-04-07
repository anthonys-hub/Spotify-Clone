import React, { useState, useEffect, useRef } from "react";
import { CiShuffle, CiVolumeHigh } from "react-icons/ci";
import { GiPreviousButton, GiNextButton } from "react-icons/gi";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { BsRepeat } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

export default function Playbar() {
    const { currentTrack, isPlaying, setIsPlaying } = useAuth();
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (currentTrack) {
            const audio = audioRef.current;
            audio.pause();


            const fallbackUrl = "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3";
            const audioSource = currentTrack.preview_url || fallbackUrl;

            audio.src = audioSource;

            audio.load();

            if (isPlaying) {
                audio.play().catch((err) => console.log("Playback failed:", err));
            }
        }
    }, [currentTrack]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, setIsPlaying]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateMetadata = () => {
            setDuration(audio.duration);
        };

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        audio.addEventListener("loadedmetadata", updateMetadata);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", () => setIsPlaying(false));

        return () => {
            audio.removeEventListener("loadedmetadata", updateMetadata);
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", () => setIsPlaying(false));
        };
    }, [setIsPlaying]);

    const formatTime = (time) => {
        if (isNaN(time) || !isFinite(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const newProgress = e.target.value;
        if (audioRef.current.duration) {
            const newTime = (newProgress / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-gray-800 flex items-center justify-between px-4 z-50 font-[Geist]">

            <div className="flex items-center gap-4 w-[30%] min-w-0">
                {currentTrack && (
                    <>
                        <img
                            src={currentTrack.album?.images?.[0]?.url}
                            className="w-12 h-12 rounded shadow-md shrink-0"
                            alt=""
                        />
                        <div className="flex flex-col truncate text-left">
                            <p className="text-white text-sm font-medium truncate hover:underline cursor-pointer">
                                {currentTrack.name}
                            </p>
                            <p className="text-gray-400 text-xs truncate hover:underline hover:text-white cursor-pointer">
                                {currentTrack.artists?.map(a => a.name).join(", ")}
                            </p>
                        </div>
                    </>
                )}
            </div>


            <div className="flex flex-col items-center w-full max-w-150 gap-2">
                <div className="flex items-center gap-6 text-white">
                    <CiShuffle size={20} className="cursor-pointer text-gray-400 hover:text-[#1DB954]" />
                    <GiPreviousButton size={20} className="cursor-pointer text-gray-400 hover:text-white" />

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:scale-105 transition active:scale-95 text-white"
                    >
                        {isPlaying ? <FaCirclePause size={36} /> : <FaCirclePlay size={36} />}
                    </button>

                    <GiNextButton size={20} className="cursor-pointer text-gray-400 hover:text-white" />
                    <BsRepeat size={20} className="cursor-pointer text-gray-400 hover:text-[#1DB954]" />
                </div>

                <div className="w-full flex items-center gap-2 group">
                    <span className="text-[11px] text-gray-400 min-w-8 text-right font-mono">
                        {formatTime(currentTime)}
                    </span>
                    <div className="relative flex-1 h-1 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={progress}
                            onChange={handleSeek}
                            className="absolute w-full h-1 bg-[#4d4d4d] rounded-full appearance-none cursor-pointer accent-transparent z-10"
                        />
                        <div
                            className="absolute h-1 bg-white group-hover:bg-[#1DB954] rounded-full pointer-events-none"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-[11px] text-gray-400 min-w-8 font-mono">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>


            <div className="w-[30%] flex justify-end items-center gap-3 pr-2">
                <CiVolumeHigh size={20} className="text-gray-400" />
                <div className="relative w-24 h-1 flex items-center group">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="absolute w-full h-1 bg-[#4d4d4d] rounded-full appearance-none cursor-pointer accent-transparent z-10"
                    />
                    <div
                        className="absolute h-1 bg-white group-hover:bg-[#1DB954] rounded-full pointer-events-none"
                        style={{ width: `${volume * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}