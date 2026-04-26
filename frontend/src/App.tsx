import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
{/** Route Declarations */}
import Games from './pages/Games'
import AllPlayers from './pages/AllPlayers'
import PlayerLeaderboard from './pages/PlayerLeaderboard'
import TopScorers from './pages/TopScorers'

const App = (): React.JSX.Element => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<AllPlayers />} />
          <Route path="/leaderboard" element={<PlayerLeaderboard />} />
          <Route path="/top-scorers" element={<TopScorers />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
