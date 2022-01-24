import axios from "axios";
import React, { useState, useContext } from "react";
import "./account.css";
import { GlobalContext } from "./context";

const Account = () => {
	const [currentUser, setCurrentUser] = useContext(GlobalContext);

	const [showLogin, setShowLogin] = useState(false);
	const [showReg, setShowReg] = useState(false);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			try {
				const res = await axios.post("http://localhost:5000/api/users/register", {
					username,
					email,
					password,
				});
				await setCurrentUser(res.data);
				localStorage.setItem("user", JSON.stringify(res.data));
				console.log(currentUser);

				setUsername("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("Passwords must match");
		}
	};
	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:5000/api/users/login", {
				username,
				password,
			});
			await setCurrentUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			console.log(currentUser);
			setUsername("");
			setPassword("");
		} catch (error) {
			alert(error);
			console.log(error);
		}
	};
	const handleLogout = async () => {
		localStorage.setItem("user", JSON.stringify(null));
		setCurrentUser(null);
	};

	const buttonClick = (button) => {
		if (button === "login") {
			setShowLogin(true);
			setShowReg(false);
		} else {
			setShowLogin(false);
			setShowReg(true);
		}

		const elem = document.getElementById("show");
		elem.classList.add("show");
	};

	return (
		<>
			<div className="button-container">
				{!currentUser && (
					<>
						<button className="accountButton" type="submit" onClick={() => buttonClick("login")}>
							Login
						</button>
						<button className="accountButton" type="submit" onClick={() => buttonClick("reg")}>
							Register
						</button>
					</>
				)}
				{currentUser && (
					<button className="accountButton" type="submit" onClick={handleLogout}>
						Logout
					</button>
				)}
			</div>
			{!currentUser && (
				<div id="show" className="input-container">
					{showReg && (
						<form onSubmit={handleRegister}>
							<input
								type="text"
								value={username}
								className="input"
								placeholder="Username"
								onChange={(e) => setUsername(e.target.value)}
							/>

							<input
								type="text"
								value={email}
								className="input"
								placeholder="email"
								onChange={(e) => setEmail(e.target.value)}
							/>

							<input
								type="password"
								value={password}
								className="input"
								placeholder="password"
								onChange={(e) => setPassword(e.target.value)}
							/>

							<input
								type="password"
								value={confirmPassword}
								className="input"
								placeholder="confirmPassword"
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>

							<button type="submit" className="submitButton">
								Register
							</button>
						</form>
					)}
					{showLogin && (
						<form onSubmit={handleLogin}>
							<input
								type="text"
								value={username}
								className="input"
								placeholder="Username"
								onChange={(e) => setUsername(e.target.value)}
							/>

							<input
								type="password"
								value={password}
								className="input"
								placeholder="password"
								onChange={(e) => setPassword(e.target.value)}
							/>

							<button type="submit" className="submitButton">
								Login
							</button>
						</form>
					)}
				</div>
			)}
			{currentUser && (
				<div className="user">
					<span>
						Logged in as <strong>{currentUser?.username}</strong>
					</span>
				</div>
			)}
		</>
	);
};

export default Account;
