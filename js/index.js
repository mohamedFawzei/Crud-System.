//arr

//hero in section sign in => sign in btn

//hero in section register => register btn
//1.get value
//2.save value in localStorage
//3.arr
//4.add value in localStorage to make user sign in with email and password
//5.make user if he didn't make checkbox on he cant register
//6.after he register going to page sign in

// Pages transitions
window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
});

document.querySelectorAll("a").forEach((link) => {
  if (link.getAttribute("href") && !link.getAttribute("href").startsWith("#")) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let href = link.getAttribute("href");

      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  }
});

//sign in section
const signInForm = document.getElementById("signIn-form");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const checkboxInput = document.getElementById("rememberMe");
const errorMessage = document.getElementById("errorMessage");
//register section
const registerForm = document.getElementById("register-form");
const firstName = document.getElementById("firstNameInput");
const lastName = document.getElementById("lastNameInput");
const registerEmail = document.getElementById("emailRegister");
const phoneRegister = document.getElementById("phoneRegister");
const passRegister = document.getElementById("passRegister");
const confirmPassRegister = document.getElementById("confirmPassRegister");
const termsCheckBox = document.getElementById("termsCheckBox");
const customSelect = document.querySelector(".custom-select-wrapper");
const customOptions = document.querySelectorAll(".custom-option");

//reset Password
const checkEmail = document.getElementById("CheckEmailInLocalStorage");
const newPassword = document.getElementById("newPasswordInput");
const confirmNewPassword = document.getElementById("confirmNewPasswordInput");

// saving users data
const users = JSON.parse(localStorage.getItem("users")) || [];
const allowedEmailDomains = [
  "gmail.com",
  "protonmail.com",
  "hotmail.com",
  "outlook.com",
];
if (customSelect) {
  customSelect.addEventListener("click", function () {
    this.classList.toggle("open");
  });

  for (let option of document.querySelectorAll(".custom-option")) {
    option.addEventListener("click", function () {
      if (!this.classList.contains("selected")) {
        let selectedText = this.textContent;
        document.querySelector(".custom-select-trigger span").textContent =
          selectedText;
      }
    });
  }
}

function signIn() {
  if (!emailInput || !passwordInput) return false;
  //get input value
  let usersData = {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };
  // Find user with matching email & password
  let existingUser = users.find(
    (user) =>
      user.email === usersData.email && user.password === usersData.password
  );
  if (existingUser) {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    if (checkboxInput.checked) {
      localStorage.setItem("loggedInUser", JSON.stringify(existingUser.email));
    } else {
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(existingUser.email)
      );
    }
    window.location.href = "dashboard.html";
  } else {
    errorMessage.textContent = "Incorrect email or password!";
    errorMessage.classList.add("show");
  }
  return false;
}

function register() {
  //get value *
  //make user select role *
  //helper to show messages *
  //add value in localStorage to make user sign in with email and password *
  //make user if he didn't make checkbox on he cant register *
  //check duplicate email *
  //save new user *
  //after he register going to page sign in *
  //clearInputs(); *
  const userRoleTrigger = document.querySelector(".custom-select-trigger span");
  const profilePictureInput = document.getElementById("profilePictureInput");
  const message = document.getElementById("registerMessage");

  function showMessage(text, isSuccess = false) {
    message.textContent = text;
    message.classList.remove("text-success", "text-danger");
    message.classList.add(isSuccess ? "text-success" : "text-danger");
    message.classList.add("show");
  }

  const selectedRole = userRoleTrigger.textContent.trim();
  if (selectedRole === "Select your role...") {
    return false;
  }

  const pictureFile = profilePictureInput.files[0];
  const reader = new FileReader();

  function finalizeRegistration(profilePictureData) {
    const userData = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: registerEmail.value.trim(),
      role: selectedRole,
      phone: phoneRegister.value.trim(),
      password: passRegister.value.trim(),
      confirmPassword: confirmPassRegister.value.trim(),
      profilePicture: profilePictureData,
    };
    if (!userData.email || !userData.password) {
      showMessage("Please fill Email and Password fields.");
      return false;
    }
    if (userData.password !== userData.confirmPassword) {
      showMessage("Passwords do not match!");
      return false;
    }
    if (!termsCheckBox.checked) {
      showMessage("You must accept the Terms of Use & Privacy Policy.");
      return false;
    }
    const emailDomain = userData.email
      .substring(userData.email.lastIndexOf("@") + 1)
      .toLowerCase();
    if (!allowedEmailDomains.includes(emailDomain)) {
      showMessage("Sorry, Its Fake Email");
      return false;
    }

    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
      showMessage("This email is already registered.");
      return false;
    }
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    showMessage("Registration successful! Redirecting...", true);
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    return true;
  }
  if (pictureFile) {
    reader.onload = () => {
      if (!finalizeRegistration(reader.result)) {
        return false;
      }
    };
    reader.onerror = () => {
      showMessage("Error reading the profile picture.");
    };
    reader.readAsDataURL(pictureFile);
  } else {
    const defaultImagePath = "imgs/default pp.jpg";
    if (!finalizeRegistration(defaultImagePath)) {
      return false;
    }
  }

  return false;
}
function changePassword() {
  // make user should text email and password
  // going in arr and localStorage to change password
  // confirm new password and confirm has a same value
  //after he click on change password make user going to sign in and text mail manual

  //get value
  let userForgetPass = {
    forgetPassEmail: checkEmail.value.trim(),
    newPassword: newPassword.value.trim(),
    confirmNewPassword: confirmNewPassword.value.trim(),
  };
  let forgetPassMsg = document.getElementById("forgetPasswordMsg");
  function showForgetMessage(text, isSuccess = false) {
    forgetPassMsg.textContent = text;
    forgetPassMsg.classList.remove("text-success", "text-danger");
    if (isSuccess) {
      forgetPassMsg.classList.add("text-success");
    } else {
      forgetPassMsg.classList.add("text-danger");
    }
    forgetPassMsg.classList.add("show");
  }

  //validation
  if (userForgetPass.forgetPassEmail === "") {
    showForgetMessage("Please Enter Your Email.");
    return false;
  } else if (
    userForgetPass.newPassword === "" ||
    userForgetPass.confirmNewPassword === ""
  ) {
    showForgetMessage("Please Enter Your New Password.");
    return false;
  }

  // find user in users arr
  let userFound = users.find(
    (user) => user.email === userForgetPass.forgetPassEmail
  );

  //check if user is found
  if (userFound) {
    if (userForgetPass.newPassword !== userForgetPass.confirmNewPassword) {
      showForgetMessage("New passwords do not match!");
      return false;
    }

    userFound.password = userForgetPass.newPassword;
    userFound.confirmPassword = userForgetPass.confirmNewPassword;

    //update local Storage
    localStorage.setItem("users", JSON.stringify(users));

    showForgetMessage("Password changed successfully!", true);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } else {
    showForgetMessage("This email is not registered.");
  }
  return false;
}
