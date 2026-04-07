import { BrowserRouter, Routes, Route } from "react-router-dom";
import Callback from "./pages/Callback";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/YourLibrary";
import Sidebar from "./components/Sidebar";
import Search from "./pages/Search";
import Playbar from "./components/Playbar";
import PlaylistDetail from './pages/PlaylistDetail';
import LikedSongs from "./pages/LikedSongs";
import SongPage from './pages/SongPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/callback' element={<Callback />} />
        <Route path='/*' element={
          <div className="flex bg-[#121212] min-h-screen text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col pb-20">
              <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/library' element={<Library />} />
                <Route path='/search' element={<Search />} />
                <Route path="/playlist/:id" element={<PlaylistDetail />} />
                <Route path="/library/liked-songs" element={<LikedSongs />} />
                <Route path="/track/:id" element={<SongPage />} />
              </Routes>
            </div>
            <Playbar />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;