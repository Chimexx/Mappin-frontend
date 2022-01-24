import { createContext, useState } from "react";

//create Context
export const GlobalContext = createContext();

//provider
export const AccountProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null || JSON.parse(localStorage.getItem("user")));

	return <GlobalContext.Provider value={[currentUser, setCurrentUser]}>{children}</GlobalContext.Provider>;
};
