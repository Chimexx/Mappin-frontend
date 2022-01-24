import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AccountProvider } from "./context";

ReactDOM.render(
	<AccountProvider>
		<App />
	</AccountProvider>,
	document.getElementById("root")
);
