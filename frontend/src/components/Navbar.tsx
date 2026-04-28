import React, { useState } from 'react'
import { Link } from 'react-router'
import {
  Navbar as ReactstrapNavbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap'

interface NavbarProps {
  isLoggedIn?: boolean
  onLoginClick: () => void
}

export const Navbar = ({ isLoggedIn = false, onLoginClick }: NavbarProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)

  const closeOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  const routes = [
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/top-scorers', label: 'Top Scorers' },
    { path: '/players', label: 'All Players' },
    { path: '/games', label: 'Games' },
    { path: '/report', label: 'Get Player Report' },
    { path: '/transfer', label: 'Transfer' }
  ]

  return (
    <ReactstrapNavbar color="light" light expand="md" className="px-3">
      <NavbarBrand tag={Link} to="/">
        NBA Analytics
      </NavbarBrand>

      <NavbarToggler onClick={toggle} />

      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto text-end text-md-start align-items-md-center" navbar>
          {routes.map((route) => (
            <NavItem key={route.path}>
              <NavLink tag={Link} to={route.path} onClick={closeOnMobile}>
                {route.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <Nav className="ms-auto text-end align-items-md-center" navbar>
          {isLoggedIn ? (
            <NavItem>
              <NavLink tag={Link} to="/admin" onClick={closeOnMobile}>
                Admin
              </NavLink>
            </NavItem>
          ) : (
            <NavItem>
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  closeOnMobile()
                  onLoginClick()
                }}
              >
                Login
              </Button>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </ReactstrapNavbar>
  )
}

export default Navbar