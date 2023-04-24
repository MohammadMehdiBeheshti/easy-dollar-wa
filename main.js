"use strict";

const users = [
	{ owner: "Admin", password: "admin", movements: [0], interestRate: 99 },

	{
		owner: "Jessica Eichmann",
		password: "hailchrist000",
		movements: [200, -400, 450, 3000, -650, -130, 70, 1300],
		interestRate: 1.5,
	},

	{
		owner: "Scott Anderson",
		password: "WLMhenrick421",
		movements: [400, -100, 250, 1000, -550, -730, 231, 1420],
		interestRate: 1.2,
	},

	{
		owner: "Joseph Himmler",
		password: "whodidnineeleven?",
		movements: [242, -410, 120, 4322, -1234, -1320, 33, 352],
		interestRate: 1.1,
	},
];

const addNewUser = (owner, password) => {
	const newUser = { owner, password, movements: [0], interestRate: 0 };
	users.push(newUser);
};

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

let notificationDisappearTime;
const notifier = (stat, text = "There was a problem!", timeOut = 2000) => {
	const toastNotification = document.querySelector(".notification");
	const toastIMG = document.querySelector(".notification__img");
	const toastText = document.querySelector(".notification__text");

	toastIMG.src = `./files/images/${stat ? "check" : "error"}-svg.svg`;
	toastText.innerText = text;
	toastNotification.style.backgroundColor = stat ? "#87CBB9" : "#FF7C7C";
	toastNotification.classList.add("notification-show");

	clearTimeout(notificationDisappearTime);
	notificationDisappearTime = setTimeout(() => {
		toastNotification.classList.remove("notification-show");
	}, timeOut);
};

const locNum = (num) => {
	const options = { style: "currency", currency: "USD" };
	return num.toLocaleString("en-US", options);
};

const caseIns = (txt) => {
	return txt.replace(/ /g, "").toLowerCase();
};

const updateBalance = (movement) => {
	const accountBalance = document.querySelector(".balance");
	const calculatedMovements = movement.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);
	accountBalance.innerText = locNum(calculatedMovements);
};

const calSummaryInfo = (movement, interestRate = 1.2) => {
	const incomeText = document.querySelector(".in");
	const outcomeText = document.querySelector(".out");
	const interestText = document.querySelector(".interest");

	const income = movement.filter((num) => num > 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	const outcome = movement
		.filter((num) => num < 0)
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	const interest = movement
		.filter((num) => num > 0)
		.map((eachDeposit) => (eachDeposit * interestRate) / 100)
		.filter((num) => num >= 1)
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	incomeText.innerText = locNum(income);
	outcomeText.innerText = locNum(Math.abs(outcome));
	interestText.innerText = locNum(interest);
};

// Register direct link
document.querySelector(".login-form-cover__link").addEventListener("click", () => switchScreen(2));
// LogIn direct link
document.querySelector(".register-form__link").addEventListener("click", () => switchScreen(1));

// LogIn Form Submission
document.querySelector(".logIn-form").addEventListener("submit", (e) => {
	e.preventDefault();
	const usernameInput = document.querySelector(".logIn-form__usernameInput").value;
	const passwordInput = document.querySelector(".logIn-form__passwordInput").value;

	if (usernameInput && passwordInput) {
		for (const eachUser of users) {
			const doesUNmatch = caseIns(usernameInput) === caseIns(eachUser.owner) || usernameInput === eachUser.owner;
			const doesPWmatch = passwordInput === eachUser.password;

			if (doesUNmatch && doesPWmatch) {
				// TODO: At this point, it should (((-- update the balance --)) && ((-- the income and the outcome and the interest --))) && the {}...
				notifier(1, "You Have successfully logged to your account");
				updateBalance(eachUser.movements);
				calSummaryInfo(eachUser.movements, eachUser.interestRate);
				switchScreen(3);
				break;
			} else {
				notifier(0, "Credentials might be incorrect");
			}
		}
	} else {
		notifier(0, "Fill out the necessary fields");
	}
});

document.querySelector(".register-form").addEventListener("submit", (e) => {
	e.preventDefault();

	const username = document.querySelector(".register-form__username-input").value;
	const password = document.querySelector(".register-form__password-input").value;
	const passConfirmation = document.querySelector(".register-form__confpass-input").value;

	if (username && password && passConfirmation) {
		if (passConfirmation === password) {
			addNewUser(username, password);
			notifier(1, "Your account has been created, Now LogIn");
			switchScreen(1);
		} else {
			notifier(0, "Password does not match");
		}
	} else {
		notifier(0, "Fill out the necessary fields");
	}
});
