import Logo from '../assets/Spotify.png'
import { redirectToSpotifyLogin } from '../Auth'

export default function Login() {
    return (
        <div className="min-h-screen bg-[#121212] text-white">

            <div className="flex items-center justify-center h-screen">
                <div className="">
                    <div className='flex justify-center'>
                        <img className="max-h-8" src={Logo} alt='Spotify Logo' />
                    </div>
                    <h1 className="flex justify-center font-[Geist] text-[44px] text-white w-81 font-bold">Welcome back</h1>

                    <button onClick={redirectToSpotifyLogin} className="font-[Geist] font-bold mt-2 bg-[#1ed760] text-black px-21 py-3 border rounded-full w-81 hover:bg-[#3be477] transition-all duration-200 ease-in-out 
               hover:scale-105 cursor-pointer">Log in with Spotify</button>


                </div>
            </div>
        </div>
    )
}
