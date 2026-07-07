document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Immediately redirect to dashboard
        window.location.replace('dashboard.html');
        return;
    }

    // Trigger page fade-in
    document.body.classList.add('loaded');

    // DOM Elements
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
    const signInSubmit = document.getElementById('signInSubmit');

    const signUpName = document.getElementById('signUpName');
    const signUpEmail = document.getElementById('signUpEmail');
    const signUpPassword = document.getElementById('signUpPassword');
    const signUpConfirmPassword = document.getElementById('signUpConfirmPassword');
    const signUpNameError = document.getElementById('signUpNameError');
    const signUpEmailError = document.getElementById('signUpEmailError');
    const signUpPasswordError = document.getElementById('signUpPasswordError');
    const signUpConfirmPasswordError = document.getElementById('signUpConfirmPasswordError');
    const signUpSuccess = document.getElementById('signUpSuccess');
    const signUpSubmit = document.getElementById('signUpSubmit');

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

    // Seed default mentor and intern users if database is empty
    if (getUsers().length === 0) {
        saveUsers([
            { name: 'Kirty Goswami', email: 'kirty@internverse.com', password: 'password123', role: 'mentor' },
            { name: 'Aarav Sharma', email: 'aarav@internverse.com', password: 'password123', role: 'intern' }
        ]);
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

    signUpBtn.addEventListener('click', () => { window.location.hash = 'signup'; });
    signInBtn.addEventListener('click', () => { window.location.hash = 'login'; });
    mobileGoSignUp.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = 'signup'; });
    mobileGoSignIn.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = 'login'; });

    function clearErrors() {
        [signInEmailError, signInPasswordError, signUpNameError, signUpEmailError, signUpPasswordError, signUpConfirmPasswordError]
            .forEach(el => { if (el) el.textContent = ''; });
        [signInEmail, signInPassword, signUpName, signUpEmail, signUpPassword, signUpConfirmPassword]
            .forEach(el => { if (el) el.classList.remove('invalid'); });
        signInSuccess.textContent = '';
        signUpSuccess.textContent = '';
    }

    /* ---------- Hash Router for Login/Signup toggles ---------- */
    function handleHashRoute() {
        if (window.location.hash === '#signup') {
            goToSignUp();
        } else {
            goToSignIn();
        }
    }

    // Initialize hash routing checks
    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);

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

    /* ---------- Loading & Transition state ---------- */
    function showLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    function redirectWithTransition(url) {
        document.body.classList.remove('loaded');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }

    /* ---------- Sign Up ---------- */
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Prevent double submit
        if (signUpSubmit.classList.contains('btn-loading')) return;

        clearErrors();
        let valid = true;

        const name = signUpName.value.trim();
        const email = signUpEmail.value.trim();
        const password = signUpPassword.value;
        const confirmPassword = signUpConfirmPassword.value;

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

        if (confirmPassword.length === 0) {
            markInvalid(signUpConfirmPassword, signUpConfirmPasswordError, 'Please confirm your password.');
            valid = false;
        } else if (password !== confirmPassword) {
            markInvalid(signUpConfirmPassword, signUpConfirmPasswordError, 'Passwords do not match.');
            valid = false;
        } else {
            markValid(signUpConfirmPassword, signUpConfirmPasswordError);
        }

        if (!valid) return;

        if (findUser(email)) {
            markInvalid(signUpEmail, signUpEmailError, 'This email is already registered.');
            showFlash('An account with this email already exists. Try signing in instead.', 'error');
            return;
        }

        // Save new user in mock backend database
        const users = getUsers();
        const newUser = { name, email, password, role: selectedSignUpRole };
        users.push(newUser);
        saveUsers(users);

        // UI state transitions
        showLoading(signUpSubmit, true);
        signUpSuccess.textContent = `Account created successfully!`;
        showFlash('Account Created Successfully!', 'success');

        // Automate login session setting
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        setTimeout(() => {
            signUpForm.reset();
            showLoading(signUpSubmit, false);
            redirectWithTransition('dashboard.html');
        }, 1200);
    });

    /* ---------- Sign In ---------- */
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Prevent double submit
        if (signInSubmit.classList.contains('btn-loading')) return;

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
            markInvalid(signInEmail, signInEmailError, 'No account found with this email.');
            showFlash('You need to sign up first before you can log in!', 'error');
            setTimeout(() => {
                window.location.hash = 'signup';
                signUpEmail.value = email;
            }, 1000);
            return;
        }

        if (user.password !== password) {
            markInvalid(signInPassword, signInPasswordError, 'Incorrect password.');
            showFlash('That password doesn\u2019t match our records.', 'error');
            return;
        }

        // Adjust role dynamically or warn (we allow the login but match the role stored)
        if (user.role !== selectedSignInRole) {
            showFlash(`Welcome back, cohort ${user.role}!`, 'success');
        } else {
            showFlash('Login Successful!', 'success');
        }

        // UI transitions
        showLoading(signInSubmit, true);
        signInSuccess.textContent = `Login Successful!`;

        // Save login session
        localStorage.setItem('currentUser', JSON.stringify(user));

        setTimeout(() => {
            signInForm.reset();
            showLoading(signInSubmit, false);
            redirectWithTransition('dashboard.html');
        }, 1000);
    });

    /* ---------- Forgot Password Custom Modal Flow ---------- */
    const forgotModal = document.getElementById('forgotModal');
    const forgotCancel = document.getElementById('forgotCancel');
    const forgotSubmit = document.getElementById('forgotSubmit');
    const forgotEmail = document.getElementById('forgotEmail');
    const forgotNewPassword = document.getElementById('forgotNewPassword');
    const forgotNewPasswordGroup = document.getElementById('forgotNewPasswordGroup');
    const forgotEmailError = document.getElementById('forgotEmailError');
    const forgotNewPasswordError = document.getElementById('forgotNewPasswordError');

    let recoveryUser = null;

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.add('show');
            forgotEmail.value = '';
            forgotNewPassword.value = '';
            forgotNewPasswordGroup.style.display = 'none';
            forgotEmail.disabled = false;
            forgotSubmit.textContent = 'Verify Email';
            if (forgotEmailError) forgotEmailError.textContent = '';
            if (forgotNewPasswordError) forgotNewPasswordError.textContent = '';
            recoveryUser = null;
        });
    }

    if (forgotCancel) {
        forgotCancel.addEventListener('click', () => {
            forgotModal.classList.remove('show');
        });
    }

    if (forgotSubmit) {
        forgotSubmit.addEventListener('click', () => {
            if (!recoveryUser) {
                // Email Verification Step
                const email = forgotEmail.value.trim();
                if (!isValidEmail(email)) {
                    if (forgotEmailError) forgotEmailError.textContent = 'Please enter a valid email address.';
                    forgotEmail.classList.add('invalid');
                    return;
                }
                
                const user = findUser(email);
                if (!user) {
                    if (forgotEmailError) forgotEmailError.textContent = 'No account found with this email.';
                    forgotEmail.classList.add('invalid');
                    return;
                }

                // Email is verified! Move to password input step
                recoveryUser = user;
                if (forgotEmailError) forgotEmailError.textContent = '';
                forgotEmail.classList.remove('invalid');
                forgotEmail.disabled = true;
                forgotNewPasswordGroup.style.display = 'block';
                forgotSubmit.textContent = 'Update Password';
            } else {
                // Password Update Step
                const newPassword = forgotNewPassword.value;
                if (newPassword.length < 6) {
                    if (forgotNewPasswordError) forgotNewPasswordError.textContent = 'Password must be at least 6 characters.';
                    forgotNewPassword.classList.add('invalid');
                    return;
                }

                const users = getUsers();
                const dbUser = users.find(u => u.email.toLowerCase() === recoveryUser.email.toLowerCase());
                if (dbUser) {
                    dbUser.password = newPassword;
                    saveUsers(users);
                    showFlash('Password updated successfully! You can now log in.', 'success');
                    forgotModal.classList.remove('show');
                }
            }
        });
    }
});