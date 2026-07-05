document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const signInBtn = document.getElementById('signIn');
    const signUpBtn = document.getElementById('signUp');
    const mobileGoSignUp = document.getElementById('mobileGoSignUp');
    const mobileGoSignIn = document.getElementById('mobileGoSignIn');

    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    const signInEmail = document.getElementById('signInEmail');
    const signInPassword = document.getElementById('signInPassword');
    const signInEmailError = document.getElementById('signInEmailError');
    const signInPasswordError = document.getElementById('signInPasswordError');
    const signInSuccess = document.getElementById('signInSuccess');

    const signUpName = document.getElementById('signUpName');
    const signUpEmail = document.getElementById('signUpEmail');
    const signUpPassword = document.getElementById('signUpPassword');
    const signUpNameError = document.getElementById('signUpNameError');
    const signUpEmailError = document.getElementById('signUpEmailError');
    const signUpPasswordError = document.getElementById('signUpPasswordError');
    const signUpSuccess = document.getElementById('signUpSuccess');

    const flashToast = document.getElementById('flashToast');

    const STORAGE_KEY = 'launchpad_users';
    let selectedSignInRole = 'intern';
    let selectedSignUpRole = 'intern';
    let flashTimer = null;

    /* ---------- Storage helpers ---------- */
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    function findUser(email) {
        return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    /* ---------- Flash toast ---------- */
    function showFlash(message, type) {
        clearTimeout(flashTimer);
        flashToast.textContent = message;
        flashToast.className = 'flash-toast show ' + (type || '');
        flashTimer = setTimeout(() => {
            flashToast.classList.remove('show');
        }, 3200);
    }

    /* ---------- Panel switching ---------- */
    function goToSignUp() {
        container.classList.add('right-panel-active');
        clearErrors();
    }

    function goToSignIn() {
        container.classList.remove('right-panel-active');
        clearErrors();
    }

    signUpBtn.addEventListener('click', goToSignUp);
    signInBtn.addEventListener('click', goToSignIn);
    mobileGoSignUp.addEventListener('click', (e) => { e.preventDefault(); goToSignUp(); });
    mobileGoSignIn.addEventListener('click', (e) => { e.preventDefault(); goToSignIn(); });

    function clearErrors() {
        [signInEmailError, signInPasswordError, signUpNameError, signUpEmailError, signUpPasswordError]
            .forEach(el => el.textContent = '');
        [signInEmail, signInPassword, signUpName, signUpEmail, signUpPassword]
            .forEach(el => el.classList.remove('invalid'));
        signInSuccess.textContent = '';
        signUpSuccess.textContent = '';
    }

    /* ---------- Role toggles ---------- */
    function setupRoleToggle(toggleEl, onSelect) {
        const buttons = toggleEl.querySelectorAll('.role-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onSelect(btn.dataset.role);
            });
        });
    }

    setupRoleToggle(document.getElementById('signInRoleToggle'), (role) => {
        selectedSignInRole = role;
    });
    setupRoleToggle(document.getElementById('signUpRoleToggle'), (role) => {
        selectedSignUpRole = role;
    });

    /* ---------- Social icon click feedback ---------- */
    document.querySelectorAll('.social').forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.add('social-active');
            setTimeout(() => icon.classList.remove('social-active'), 900);
        });
    });

    /* ---------- Validation helpers ---------- */
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function markInvalid(input, errorEl, message) {
        input.classList.add('invalid');
        errorEl.textContent = message;
    }

    function markValid(input, errorEl) {
        input.classList.remove('invalid');
        errorEl.textContent = '';
    }

    /* ---------- Sign Up ---------- */
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let valid = true;

        const name = signUpName.value.trim();
        const email = signUpEmail.value.trim();
        const password = signUpPassword.value;

        if (name.length < 2) {
            markInvalid(signUpName, signUpNameError, 'Please enter your full name.');
            valid = false;
        } else {
            markValid(signUpName, signUpNameError);
        }

        if (!isValidEmail(email)) {
            markInvalid(signUpEmail, signUpEmailError, 'Please enter a valid email address.');
            valid = false;
        } else {
            markValid(signUpEmail, signUpEmailError);
        }

        if (password.length < 6) {
            markInvalid(signUpPassword, signUpPasswordError, 'Password must be at least 6 characters.');
            valid = false;
        } else {
            markValid(signUpPassword, signUpPasswordError);
        }

        if (!valid) return;

        if (findUser(email)) {
            markInvalid(signUpEmail, signUpEmailError, 'This email is already registered.');
            showFlash('An account with this email already exists. Try signing in instead.', 'error');
            return;
        }

        const users = getUsers();
        users.push({ name, email, password, role: selectedSignUpRole });
        saveUsers(users);

        signUpSuccess.textContent = `Account created as ${selectedSignUpRole}. You can now sign in.`;
        showFlash('Registration successful! Please sign in.', 'success');
        signUpForm.reset();

        setTimeout(() => {
            goToSignIn();
            signInEmail.value = email;
        }, 1100);
    });

    /* ---------- Sign In ---------- */
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let valid = true;

        const email = signInEmail.value.trim();
        const password = signInPassword.value;

        if (!isValidEmail(email)) {
            markInvalid(signInEmail, signInEmailError, 'Please enter a valid email address.');
            valid = false;
        } else {
            markValid(signInEmail, signInEmailError);
        }

        if (password.length === 0) {
            markInvalid(signInPassword, signInPasswordError, 'Please enter your password.');
            valid = false;
        } else {
            markValid(signInPassword, signInPasswordError);
        }

        if (!valid) return;

        const user = findUser(email);

        if (!user) {
            // Not registered yet -- ask them to sign up first
            markInvalid(signInEmail, signInEmailError, 'No account found with this email.');
            showFlash('You need to sign up first before you can log in!', 'error');
            setTimeout(() => {
                goToSignUp();
                signUpEmail.value = email;
            }, 1000);
            return;
        }

        if (user.password !== password) {
            markInvalid(signInPassword, signInPasswordError, 'Incorrect password.');
            showFlash('That password doesn\u2019t match our records.', 'error');
            return;
        }

        if (user.role !== selectedSignInRole) {
            showFlash(`This account is registered as ${user.role}, not ${selectedSignInRole}. Signing you in as ${user.role}.`, 'error');
        } else {
            showFlash(`Welcome back, ${user.name}!`, 'success');
        }

        signInSuccess.textContent = `Signed in as ${user.name} (${user.role}).`;
        signInForm.reset();
    });
});