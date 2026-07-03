const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector('.container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

/* -------------------- Validation -------------------- */

// RFC-5322-inspired practical email regex (covers the vast majority of real addresses)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function setFieldState(inputEl, errorEl, message) {
    if (message) {
        inputEl.classList.add('invalid');
        inputEl.classList.remove('valid');
        errorEl.textContent = message;
        errorEl.classList.add('show');
        return false;
    } else {
        inputEl.classList.remove('invalid');
        inputEl.classList.add('valid');
        errorEl.textContent = '';
        errorEl.classList.remove('show');
        return true;
    }
}

function validateEmail(inputEl, errorEl) {
    const value = inputEl.value.trim();
    if (value === '') {
        return setFieldState(inputEl, errorEl, 'Email is required.');
    }
    if (!EMAIL_REGEX.test(value)) {
        return setFieldState(inputEl, errorEl, 'Enter a valid email address (e.g. name@example.com).');
    }
    return setFieldState(inputEl, errorEl, '');
}

function validatePassword(inputEl, errorEl) {
    const value = inputEl.value;
    if (value === '') {
        return setFieldState(inputEl, errorEl, 'Password is required.');
    }
    if (value.length < 6) {
        return setFieldState(inputEl, errorEl, 'Password must be at least 6 characters.');
    }
    return setFieldState(inputEl, errorEl, '');
}

function validateName(inputEl, errorEl) {
    const value = inputEl.value.trim();
    if (value === '') {
        return setFieldState(inputEl, errorEl, 'Name is required.');
    }
    if (value.length < 2) {
        return setFieldState(inputEl, errorEl, 'Name must be at least 2 characters.');
    }
    return setFieldState(inputEl, errorEl, '');
}

function showSuccess(el, message) {
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

/* -------- Sign In form -------- */
const signInForm = document.getElementById('signInForm');
const signInEmail = document.getElementById('signInEmail');
const signInPassword = document.getElementById('signInPassword');
const signInEmailError = document.getElementById('signInEmailError');
const signInPasswordError = document.getElementById('signInPasswordError');
const signInSuccess = document.getElementById('signInSuccess');

// live validation as the user leaves a field
signInEmail.addEventListener('blur', () => validateEmail(signInEmail, signInEmailError));
signInPassword.addEventListener('blur', () => validatePassword(signInPassword, signInPasswordError));

// clear error as soon as user starts correcting it
signInEmail.addEventListener('input', () => {
    if (signInEmail.classList.contains('invalid')) validateEmail(signInEmail, signInEmailError);
});
signInPassword.addEventListener('input', () => {
    if (signInPassword.classList.contains('invalid')) validatePassword(signInPassword, signInPasswordError);
});

signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(signInEmail, signInEmailError);
    const isPasswordValid = validatePassword(signInPassword, signInPasswordError);

    if (isEmailValid && isPasswordValid) {
        showSuccess(signInSuccess, 'Signed in successfully!');
        // Hook your real authentication call here
    }
});

/* -------- Sign Up form -------- */
const signUpForm = document.getElementById('signUpForm');
const signUpName = document.getElementById('signUpName');
const signUpEmail = document.getElementById('signUpEmail');
const signUpPassword = document.getElementById('signUpPassword');
const signUpNameError = document.getElementById('signUpNameError');
const signUpEmailError = document.getElementById('signUpEmailError');
const signUpPasswordError = document.getElementById('signUpPasswordError');
const signUpSuccess = document.getElementById('signUpSuccess');

signUpName.addEventListener('blur', () => validateName(signUpName, signUpNameError));
signUpEmail.addEventListener('blur', () => validateEmail(signUpEmail, signUpEmailError));
signUpPassword.addEventListener('blur', () => validatePassword(signUpPassword, signUpPasswordError));

signUpName.addEventListener('input', () => {
    if (signUpName.classList.contains('invalid')) validateName(signUpName, signUpNameError);
});
signUpEmail.addEventListener('input', () => {
    if (signUpEmail.classList.contains('invalid')) validateEmail(signUpEmail, signUpEmailError);
});
signUpPassword.addEventListener('input', () => {
    if (signUpPassword.classList.contains('invalid')) validatePassword(signUpPassword, signUpPasswordError);
});

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isNameValid = validateName(signUpName, signUpNameError);
    const isEmailValid = validateEmail(signUpEmail, signUpEmailError);
    const isPasswordValid = validatePassword(signUpPassword, signUpPasswordError);

    if (isNameValid && isEmailValid && isPasswordValid) {
        showSuccess(signUpSuccess, 'Account created successfully!');
        // Hook your real registration call here
    }
});