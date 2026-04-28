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
import PlayerReport from './pages/PlayerReport'
import React from 'react'
import LoginModal from './components/LoginModal'
import TransferPlayer from './pages/TransferPlayer'



const App = (): React.JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false)
  const [loginModalOpen, setLoginModalOpen] = React.useState<boolean>(false)
  const toggleLoginModal = (): void => setLoginModalOpen(!loginModalOpen)
  return (
    <>
      <LoginModal isOpen={loginModalOpen} toggle={toggleLoginModal} onLoginSuccess={() => setIsLoggedIn(true)} />
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} onLoginClick={toggleLoginModal} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<AllPlayers isAdmin={isLoggedIn} />} />
          <Route path="/leaderboard" element={<PlayerLeaderboard />} />
          <Route path="/top-scorers" element={<TopScorers />} />
          <Route path="/games" element={<Games />} />
          <Route path="/report" element={<PlayerReport />} />
          <Route path="/transfer" element={<TransferPlayer />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
