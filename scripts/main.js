"use strict";

const users = [
	{
		owner: "Admin",
		password: "admin",
		balance: 0,
		movements: [
			{ amount: 9000, date: "05/02/2023" },
			{ amount: 8000, date: "04/20/2023" },
			{ amount: 7000, date: "04/30/2021" },
			{ amount: 6000, date: "01/21/2020" },
			{ amount: 5000, date: "10/25/2019" },
			{ amount: 4000, date: "12/01/2018" },
			{ amount: 3000, date: "08/22/2017" },
			{ amount: 2000, date: "09/11/2016" },
		],
		interestRate: 2,
	},

	{
		owner: "1",
		password: "1",
		balance: 0,
		movements: [{ amount: 0, date: "-" }],
		interestRate: 2,
	},
];

function addNewUser(owner, password) {
	const newUser = {
		owner,
		password,
		balance: 0,
		movements: [{ amount: 0, date: timeChecker("date") }],
		interestRate: 1.1,
	};

	users.push(newUser);
}

function switchScreen(screen) {
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
}

function formValidation(type, txt) {
	const regexForPass = /^(?=.*[!@#$%^&*()_+={}|[\]\\:;"'<>,.?/])(?=.*[A-Z]).+$/;
	const isItMoreThanEight = txt.length >= 8;

	if (type === "pass") {
		return regexForPass.test(txt) && isItMoreThanEight;
	} else {
		return txt.includes(" ");
	}
}

function locNum(num) {
	const options = { style: "currency", currency: "USD" };
	return num.toLocaleString("en-US", options);
}

function caseIns(txt) {
	return txt.replace(/ /g, "").toLowerCase();
}

function timeChecker(type = "time") {
	const date = new Date();

	const locale = "en-US";

	const fullTimeOptions = {
		hour: "numeric",
		hour12: true,
		minute: "numeric",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};

	const dateOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};

	const timeClockOption = {
		hour: "numeric",
		hour12: false,
		minute: "numeric",
	};

	return new Intl.DateTimeFormat(
		locale,
		type === "date" ? dateOptions : type === "clock" ? timeClockOption : fullTimeOptions
	).format(date);
}

function logOut() {
	document.querySelector(".input-amount-money-transfer").value = "";
	document.querySelector(".input-amount-request-loan").value = "";
	document.querySelector(".input-transfer").value = "";

	transactionContainer.querySelectorAll(".transaction").forEach((each) => each.remove());

	noTransacMsg.style.display = "block";

	switchScreen(1);
}

let notificationDisappearTime;
function notifier(stat, text = "There was a problem!", timeOut = 2000) {
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
}

let logOutTimeOut;
function logOutTimer(time = 1000) {
	const timerCountDown = document.querySelector(".timer");

	let timer = 600;

	clearInterval(logOutTimeOut);
	logOutTimeOut = setInterval(() => {
		const minutes = String(Math.trunc(timer / 60)).padStart(2, 0);
		const seconds = String(timer % 60).padStart(2, 0);
		timerCountDown.innerText = `${minutes} : ${seconds}`;
		timer--;

		if (timer === 0) {
			clearInterval(logOutTimeOut);
			logOut();
		}
	}, time);
}

function displayGreetings(user) {
	const greetingTitle = document.querySelector(".upper-container-greetings__info");
	const greetingDate = document.querySelector(".greetings__date");
	const [time, clock] = [timeChecker("time"), timeChecker("clock")];
	const hour = +clock.substring(0, 2);

	const event =
		hour >= 5 && hour <= 11
			? "Good Morning"
			: hour >= 12 && hour <= 18
			? "Good Afternoon"
			: hour >= 19 && hour <= 23
			? "Good Night"
			: "Welcome Back";

	const name = user.split(" ").at(0);
	greetingTitle.innerText = `${event}, ${name}!`;
	greetingDate.innerText = time;
}

function updateBalance(account) {
	const accountBalance = document.querySelector(".balance");
	account.balance = account.movements
		.map((each) => each.amount)
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	accountBalance.innerText = locNum(account.balance);
}

function calSummaryInfo(movement, interestRate = 1.2) {
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
}

const noTransacMsg = document.querySelector(".empty-container");
const transactionContainer = document.querySelector(".transactions-container");
function displayTransactions(account, sort) {
	const compareTime = (date1, date2) => {
		const days = (Number(new Date(date1)) - Number(new Date(date2))) / (1000 * 60 * 60 * 24);
		const result =
			days === 0 ? "Today" : days === 1 ? "Yesterday" : days >= 2 && days <= 30 ? `${days} Days ago` : date2;
		return result;
	};

	const renderTransaction = (element, i) => {
		const transaction = document.createElement("li");
		transaction.className = "transaction";
		transaction.innerHTML = `
		<div class="transac-date-time">
		<span class="transac-date__stat">${i + 1} ${element.amount > 0 ? "Deposit" : "Withdraw"}</span>
		<span class="transaction__date">${compareTime(timeChecker("date"), element.date)}</span>
		</div>
		<h4 class="transaction-amount">${locNum(element.amount)}</h4>
		`;
		return transaction;
	};

	const itDoesNotPass =
		account.movements.map((each) => each.amount).length <= 1 ||
		Number(account.movements.map((each) => each.amount).join("")) === 0;

	if (itDoesNotPass) {
		noTransacMsg.style.display = "block";
	} else {
		noTransacMsg.style.display = "none";

		const movements = sort
			? account.movements.sort((a, b) => (sort === 1 ? a.amount - b.amount : b.amount - a.amount))
			: account.movements;

		transactionContainer.querySelectorAll(".transaction").forEach((each) => each.remove());

		movements.forEach((each, index) => {
			if (each.amount !== 0) transactionContainer.append(renderTransaction(each, index));
		});
	}

	document.querySelectorAll(".transac-date__stat").forEach((each) => {
		const color = each.innerText.includes("Deposit") ? "#88a47c" : "#f55050";
		each.style.backgroundColor = color;
	});
}

// Register direct link
document.querySelector(".login-form-cover__link").addEventListener("click", () => switchScreen(2));
// LogIn direct link
document.querySelector(".register-form__link").addEventListener("click", () => switchScreen(1));

// LogIn Form Submission
let currentAccount;
document.querySelector(".logIn-form").addEventListener("submit", (e) => {
	e.preventDefault();
	const usernameInput = document.querySelector(".logIn-form__usernameInput").value;
	const passwordInput = document.querySelector(".logIn-form__passwordInput").value;

	if (usernameInput && passwordInput) {
		for (const eachUser of users) {
			const doesUNmatch = caseIns(usernameInput) === caseIns(eachUser.owner) || usernameInput === eachUser.owner;
			const doesPWmatch = passwordInput === eachUser.password;

			if (doesUNmatch && doesPWmatch) {
				notifier(1, "You Have successfully logged to your account", 1000);
				updateBalance(eachUser);
				displayGreetings(eachUser.owner);
				displayTransactions(eachUser);
				calSummaryInfo(
					eachUser.movements.map((each) => each.amount),
					eachUser.interestRate
				);
				switchScreen(3);
				logOutTimer();
				currentAccount = eachUser;
				e.currentTarget.reset();
				break;
			} else {
				notifier(0, "Credentials might be incorrect");
			}
		}
	} else {
		notifier(0, "Fill out the necessary fields");
	}
});

// Register Form Submission
document.querySelector(".register-form").addEventListener("submit", (e) => {
	e.preventDefault();

	const username = document.querySelector(".register-form__username-input").value;
	const password = document.querySelector(".register-form__password-input").value;
	const passConfirmation = document.querySelector(".register-form__confpass-input").value;

	if (username && password && passConfirmation) {
		if (formValidation("username", username)) {
			if (formValidation("pass", password)) {
				if (passConfirmation === password) {
					addNewUser(username, password);
					notifier(1, "Your account has been created, Now LogIn");
					switchScreen(1);
					e.currentTarget.reset();
				} else {
					notifier(0, "Password does not match");
				}
			} else {
				notifier(0, "Choose a proper password");
			}
		} else {
			notifier(0, "Please write your full name!");
		}
	} else {
		notifier(0, "Fill out the necessary fields");
	}
});

// Transfer Money
document.querySelector(".transfer-confirmation-btn").addEventListener("click", () => {
	const amountOfMoney = Number(document.querySelector(".input-amount-money-transfer").value);
	const transferInput = document.querySelector(".input-transfer").value;
	const moneyReceiver = users.find(
		(eachUser) => transferInput === eachUser.owner || caseIns(transferInput) === caseIns(eachUser.owner)
	);
	const possibleToTransfer = currentAccount.balance >= amountOfMoney && currentAccount.balance > 0;

	if (amountOfMoney ?? transferInput) {
		if (possibleToTransfer) {
			if (moneyReceiver) {
				if (currentAccount?.owner !== moneyReceiver.owner) {
					currentAccount.movements.push({ amount: -amountOfMoney, date: timeChecker("date") });
					moneyReceiver.movements.push({ amount: amountOfMoney, date: timeChecker("date") });
					displayTransactions(currentAccount);
					updateBalance(currentAccount);
					calSummaryInfo(
						currentAccount.movements.map((each) => each.amount),
						currentAccount.interestRate
					);
					notifier(1, `${amountOfMoney} transferred to ${moneyReceiver.owner}`);
				} else {
					notifier(0, "You can't transfer money to yourself!");
				}
			} else {
				notifier(0, "User not found!");
			}
		} else {
			notifier(0, "No enough money ☹️");
		}
	} else {
		notifier(0, "Fill out the necessary fields");
	}
});

// Request Loan
document.querySelector(".request-loan-confirmation").addEventListener("click", () => {
	const loanRequestInput = document.querySelector(".input-amount-request-loan");
	const loanAmount = Number(loanRequestInput.value);
	const loanLimit = 10;
	const includesTenPercent = currentAccount.movements
		.map((each) => each.amount)
		.some((eachTransaction) => eachTransaction >= loanAmount / loanLimit);

	if (loanAmount && includesTenPercent) {
		currentAccount.movements.push({ amount: loanAmount, date: timeChecker("date") });
		updateBalance(currentAccount);
		displayTransactions(currentAccount);
		calSummaryInfo(
			currentAccount.movements.map((each) => each.amount),
			currentAccount.interestRate
		);
		loanRequestInput.value = "";
		notifier(1, `${loanAmount} has been added to your account`);
	} else {
		notifier(0, "Error");
	}
});

// Logout BTN
document.querySelector(".dashboard__logout-btn").addEventListener("click", () => logOut());

// Delete Account
const deleteAccBTN = document.querySelector(".dashboard-delete-account-btn");
deleteAccBTN.addEventListener("click", () => {
	deleteAccBTN.classList.add("dashboard-delete-account-btn-show");
});

const usernameInput = document.querySelector(".delete-account-username");
const passwordInput = document.querySelector(".delete-account-password");

document.querySelector(".delete-account-cancel").addEventListener("click", (e) => {
	e.stopPropagation();
	deleteAccBTN.classList.remove("dashboard-delete-account-btn-show");
	usernameInput.value = "";
	passwordInput.value = "";
});

document.querySelector(".delete-account-confirm").addEventListener("click", (e) => {
	e.stopPropagation();
	const isPassAndUnCorrect =
		(usernameInput.value === currentAccount.owner || caseIns(usernameInput.value) === caseIns(currentAccount.owner)) &&
		passwordInput.value === currentAccount.password;

	if (usernameInput.value ?? passwordInput.value) {
		if (isPassAndUnCorrect) {
			const deletedAccount = users.find((eachUser) => currentAccount.owner === eachUser.owner);
			users.splice(users.indexOf(deletedAccount), 1);
			usernameInput.value = "";
			passwordInput.value = "";
			deleteAccBTN.classList.remove("dashboard-delete-account-btn-show");
			logOut();
			notifier(1, "Your account has been successfully deleted");
		} else {
			notifier(0, "Credentials don't match");
		}
	} else {
		notifier(0, "Fill out the necessary fields");
	}
});

// Sort
let repeat = true;
const svgSort = document.querySelector(".svg-sort");
document.querySelector(".sort").addEventListener("click", () => {
	if (repeat) {
		displayTransactions(currentAccount, 1);
		svgSort.classList.add("svg-sort--rotate");
		repeat = false;
	} else {
		displayTransactions(currentAccount, 2);
		svgSort.classList.remove("svg-sort--rotate");
		repeat = true;
	}
});

// switchScreen(3);
