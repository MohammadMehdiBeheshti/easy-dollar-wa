"use strict";

const users = [
	[{ username: "jessica", password: "jessi123" }],
	[{ username: "micheal", password: "mikethemachineweaver" }],
	[{ username: "tyrone", password: "theroad123" }],
];

const addUser = (username, password) => {
	const newUser = [{ username, password }];
	users.push(newUser);
};

const switchScreen = (screen) => {
	// TODO: Make the main screen and put it in here

	const loginFormCover = document.querySelector(".login-form-cover");
	const registerFormCover = document.querySelector(".register-form-cover");

	if (screen === 1) {
		registerFormCover.style.display = "none";
		loginFormCover.style.display = "flex";
	} else if (screen === 2) {
		loginFormCover.style.display = "none";
		registerFormCover.style.display = "flex";
	} else if (screen === 3) {
		loginFormCover.style.display = "none";
		registerFormCover.style.display = "none";
	}
};

document.querySelector(".logIn-form__submitbtn").addEventListener("click", (e) => {
	e.preventDefault();
	const loginFormUsername = document.querySelector(".logIn-form__usernameInput");
	const loginFormPassword = document.querySelector(".logIn-form__passwordInput");

	if (loginFormUsername.value && loginFormPassword.value) addUser(loginFormUsername.value, loginFormPassword.value);

	console.log(users);
});

switchScreen(2);
