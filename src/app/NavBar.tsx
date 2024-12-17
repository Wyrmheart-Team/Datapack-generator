import styled from "styled-components";
import { NavLink as Link, useLocation } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import { RouteMaps } from "../App.tsx";

// Nav: The container for the entire navigation bar
export const Nav = styled.nav`
	display: flex;
	gap: 20px;
	background: #282c34;
	height: auto;
	width: 100%;
	box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2); /* Subtle shadow */
	position: relative;
	top: 0;
	left: 0;
	z-index: 1000;
`;

// Title: The title of the website, displayed above the buttons
export const Title = styled.h1`
	color: ${({ theme }) => theme.textColor}; // Text color matches theme
	font-size: 24px;
	margin-top: 20px;
	margin-left: 10px;
`;

const Navbar = () => {
	const location = useLocation();

	return (
		<>
			<Nav>
				<Title>Wyrmheart Team</Title>
				<SelectField
					displayEmpty
					renderValue={() =>
						RouteMaps.find((s) => s.path === location.pathname)?.name
					}
				>
					{RouteMaps.map((route) => (
						<MenuItem component={Link} to={route.path} key={route.path}>
							{route.name}
						</MenuItem>
					))}
				</SelectField>
			</Nav>
		</>
	);
};

const SelectField = styled(Select)`
	height: 100%;
	border-radius: 0;
	font-size: 16px;

	& .MuiSelect-icon,
	& .MuiSelect-select {
		color: white;
	}

	& .MuiOutlinedInput-notchedOutline {
		border: none;
	}
`;

export default Navbar;
