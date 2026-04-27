import React, {useState} from 'react'
import { Link } from 'react-router'
import {
    Navbar as ReactstrapNavbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap'

export const Navbar = (): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = (): void => setIsOpen(!isOpen);

    const closeOnMobile = (): void => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };
    
    const routes = [
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/top-scorers', label: 'Top Scorers' },
        { path: '/players', label: 'All Players' },
        { path: '/games', label: 'Games' },
        { path: '/report', label: 'Get Player Report' }
    ];

    return (
        <ReactstrapNavbar color="light" light expand="md">
            <NavbarBrand href="/">NBA Analytics</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ms-auto w-100 w-md-auto text-end" navbar>
                    {routes.map((route) => (
                        <NavItem key={route.path}>
                            <NavLink tag={Link} to={route.path} onClick={closeOnMobile}>
                                {route.label}
                            </NavLink>
                        </NavItem>
                    ))}
                </Nav>
            </Collapse>
        </ReactstrapNavbar>
    )
}

export default Navbar;