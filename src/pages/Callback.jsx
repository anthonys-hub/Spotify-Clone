import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Callback() {
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const codeVerifier = localStorage.getItem('code_verifier')

        if (!code || !codeVerifier) return

        localStorage.removeItem('code_verifier')

        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: import.meta.env.VITE_REDIRECT_URI,
                code_verifier: codeVerifier,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token)
                    navigate('/dashboard')
                }
            })
    }, [])

    return <div>Logging in...</div>
}