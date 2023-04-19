"use strict";

const users = [[{ username: "jessica", password: "jessi123" }]];

const switchScreen = (screen) => {
	const dashboard = document.querySelector(".dashboard");
	const loginFormCover = document.querySelector(".login-form-cover");
	const registerFormCover = document.querySelector(".register-form-cover");

	if (screen === 1) {
		dashboard.style.display = "none";
		registerFormCover.style.display = "none";
		loginFormCover.style.display = "flex";
	} else if (screen === 2) {
		dashboard.style.display = "none";
		loginFormCover.style.display = "none";
		registerFormCover.style.display = "flex";
	} else if (screen === 3) {
		loginFormCover.style.display = "none";
		registerFormCover.style.display = "none";
		dashboard.style.display = "block";
	}
};

switchScreen(3);
