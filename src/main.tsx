import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import styled from "styled-components";

const LoadingElement = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
`;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense fallback={<LoadingElement>Loading...</LoadingElement>}>
			<App />
		</Suspense>
	</StrictMode>
);
