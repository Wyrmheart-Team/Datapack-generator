import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import styled from "styled-components";
import { FormProvider } from "./Form.tsx";

const LoadingElement = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
`;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<FormProvider>
			<App />
		</FormProvider>
	</StrictMode>
);
