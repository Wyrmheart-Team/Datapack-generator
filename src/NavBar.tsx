import styled from "styled-components";
import { NavLink as Link, useLocation } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
// Nav: The container for the entire navigation bar
export const Nav = styled.nav`
	background: #282c34;
	color: ${({ theme }) => theme.textColor}; // Text color matches theme
	height: auto;
	width: calc(100vw - 40px);
	padding: 20px 20px;
	box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2); /* Subtle shadow */
	position: sticky;
	top: 0;
	left: 0;
	z-index: 2000;
`;

// NavMenu: A container for the navigation links (usually in a row)
export const NavMenu = styled.div`
	display: flex;
	align-items: center;
	gap: 20px; /* Space between nav links */
`;

// NavLink: Each button/link inside the NavMenu, styling react-router-dom's NavLink component
export const NavLink = styled(Link)`
	color: #90caf9; /* Muted blue color for the links */
	text-decoration: none;
	padding: 10px 15px;
	font-size: 16px;
	font-weight: 500;
	border-radius: 4px;
	transition:
		background-color 0.3s ease,
		color 0.3s ease;

	&.active {
		background-color: #555; /* Highlight for the active link */
		color: #ffffff;
	}

	&:hover {
		background-color: #555; /* Slightly lighter gray on hover */
		color: #ffffff; /* Turn text white on hover */
	}

	&:active {
		background-color: #444; /* Even lighter gray for active state */
	}
`;

// Title: The title of the website, displayed above the buttons
export const Title = styled.h1`
	color: ${({ theme }) => theme.textColor}; // Text color matches theme
	font-size: 24px;
	margin: 0 0 25px;
`;

const Navbar = ({ onSave }: { onSave: (arg: string) => void }) => {
	const location = useLocation();
	return (
		<>
			<Nav>
				<Title>Wyrmheart Team - Datapack Generator</Title>
				{/* <SaveButton */}
				{/* 	onClick={() => onSave("mod")} */}
				{/* 	sx={{ */}
				{/* 		right: "200px !important", */}
				{/* 	}} */}
				{/* > */}
				{/* 	<SaveIcon /> */}
				{/* 	Save as Mod */}
				{/* </SaveButton> */}
				<SaveButton onClick={() => onSave("zip")}>
					<SaveIcon />
					Save as Zip
				</SaveButton>
				<NavMenu>
					<NavLink to="/">Dragon Mounts Remastered</NavLink>
				</NavMenu>
			</Nav>
		</>
	);
};

const SaveButton = styled(IconButton)`
	background-color: #007bff !important;
	color: white !important;
	border: none;
	border-radius: 15px !important;
	padding: 0.5rem;
	font-size: 16px;
	cursor: pointer;
	position: absolute !important;
	right: 20px !important;
	top: 50px !important;
`;

export default Navbar;
