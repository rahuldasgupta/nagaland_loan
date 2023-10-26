import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

import "./Navbar.css";


export const Nav = styled.nav`
background-color: #1a2a36;
font-size: 17.5px;
display: flex;
justify-content: flex-start;
font-family: 'Rubik', sans-serif;
z-index: 12;
padding-left: 15px;
padding-right: 0px;
elevation: 5;
@media screen and (max-width: 769px) {
	height: 60px;
}
@media screen and (min-width: 770px) {
	height: 64px;
}
`;

export const NavLink = styled(Link)`
display: flex;
align-items: center;
text-decoration: none;
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
width: 100%;
/* Second Nav */
/* margin-right: 24px; */
/* Third Nav */
/* width: 100vw;
white-space: nowrap; */
@media screen and (max-width: 768px) {
	display: none;
}
`;

