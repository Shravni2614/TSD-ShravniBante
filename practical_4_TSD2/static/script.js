/* ============================================
   AeroBook — Main JavaScript
   Handles: Form switching, validation,
   password visibility, toast notifications
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- DOM References ----
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');

    // Toast elements
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.getElementById('toastClose');

    // Forgot password link
    const forgotLink = document.getElementById('forgotPassword');

    // ---- Utility: Show Toast ----
    function showToast(message, type = 'success') {
        const icon = type === 'success' ? '✈️' : '⚠️';
        toastIcon.textContent = icon;
        toastMessage.textContent = message;
        toast.className = 'toast ' + type;
        // Force reflow for animation restart
        void toast.offsetWidth;
        toast.classList.add('show');

        // Auto-hide after 5 seconds
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // ---- Toast close button ----
    toastClose.addEventListener('click', () => {
        toast.classList.remove('show');
        clearTimeout(toast._timeout);
    });

    // ---- Switch: Login → Register ----
    function switchToRegisterForm() {
        // Remove active from login, add to register
        loginForm.classList.remove('active');
        registerForm.classList.add('active');

        // Clear any previous errors
        clearAllErrors();

        // Reset form fields
        registerFormElement.reset();
        loginFormElement.reset();

        // Remove error states from inputs
        document.querySelectorAll('.input-wrapper').forEach(w => w.classList.remove('error'));
    }

    // ---- Switch: Register → Login ----
    function switchToLoginForm() {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');

        clearAllErrors();
        registerFormElement.reset();
        loginFormElement.reset();

        document.querySelectorAll('.input-wrapper').forEach(w => w.classList.remove('error'));
    }

    // ---- Event listeners for switching ----
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        switchToRegisterForm();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLoginForm();
    });

    // ---- Forgot Password ----
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🔐 Password recovery will be available soon.', 'error');
    });

    // ---- Password Visibility Toggle ----
    function setupPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (!toggle || !input) return;

        function toggleVisibility() {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggle.textContent = isPassword ? '🔓' : '🔒';
        }

        toggle.addEventListener('click', toggleVisibility);
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleVisibility();
            }
        });
    }

    // Setup all password toggles
    setupPasswordToggle('loginToggle', 'loginPassword');
    setupPasswordToggle('registerToggle', 'registerPassword');
    setupPasswordToggle('confirmToggle', 'registerConfirm');

    // ---- Validation Helpers ----
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) {
            input.closest('.input-wrapper')?.classList.add('error');
            // Add shake
            input.closest('.input-wrapper')?.classList.add('shake');
            setTimeout(() => {
                input.closest('.input-wrapper')?.classList.remove('shake');
            }, 400);
        }
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearFieldError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) {
            input.closest('.input-wrapper')?.classList.remove('error');
        }
        if (errorEl) {
            errorEl.textContent = '';
        }
    }

    function clearAllErrors() {
        const errorIds = [
            'loginEmailError', 'loginPasswordError',
            'registerNameError', 'registerEmailError',
            'registerPasswordError', 'registerConfirmError',
            'termsError'
        ];
        const inputIds = [
            'loginEmail', 'loginPassword',
            'registerName', 'registerEmail',
            'registerPassword', 'registerConfirm'
        ];
        errorIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.closest('.input-wrapper')?.classList.remove('error');
            }
        });
    }

    // ---- Login Validation ----
    function validateLogin() {
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        let isValid = true;

        // Clear previous errors
        clearFieldError('loginEmail', 'loginEmailError');
        clearFieldError('loginPassword', 'loginPasswordError');

        // Validate Email
        if (!email.value.trim()) {
            showFieldError('loginEmail', 'loginEmailError', 'Please enter your email address.');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showFieldError('loginEmail', 'loginEmailError', 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Password
        if (!password.value.trim()) {
            showFieldError('loginPassword', 'loginPasswordError', 'Please enter your password.');
            isValid = false;
        }

        return isValid;
    }

    // ---- Registration Validation ----
    function validateRegistration() {
        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const password = document.getElementById('registerPassword');
        const confirm = document.getElementById('registerConfirm');
        const terms = document.getElementById('termsCheck');
        let isValid = true;

        // Clear previous errors
        clearFieldError('registerName', 'registerNameError');
        clearFieldError('registerEmail', 'registerEmailError');
        clearFieldError('registerPassword', 'registerPasswordError');
        clearFieldError('registerConfirm', 'registerConfirmError');
        const termsError = document.getElementById('termsError');
        if (termsError) termsError.textContent = '';

        // Validate Name
        if (!name.value.trim()) {
            showFieldError('registerName', 'registerNameError', 'Please enter your full name.');
            isValid = false;
        }

        // Validate Email
        if (!email.value.trim()) {
            showFieldError('registerEmail', 'registerEmailError', 'Please enter your email address.');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showFieldError('registerEmail', 'registerEmailError', 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Password
        if (!password.value.trim()) {
            showFieldError('registerPassword', 'registerPasswordError', 'Please create a password.');
            isValid = false;
        } else if (password.value.trim().length < 8) {
            showFieldError('registerPassword', 'registerPasswordError', 'Password must be at least 8 characters.');
            isValid = false;
        }

        // Validate Confirm Password
        if (!confirm.value.trim()) {
            showFieldError('registerConfirm', 'registerConfirmError', 'Please confirm your password.');
            isValid = false;
        } else if (password.value.trim() !== confirm.value.trim()) {
            showFieldError('registerConfirm', 'registerConfirmError', 'Passwords do not match.');
            isValid = false;
        }

        // Validate Terms
        if (!terms.checked) {
            const err = document.getElementById('termsError');
            if (err) err.textContent = 'You must agree to the Terms & Conditions.';
            isValid = false;
        }

        return isValid;
    }

   // ---- Login Form Submit ----
loginFormElement.addEventListener('submit', async (e) => {

    e.preventDefault();

    if (!validateLogin()) {
        return;
    }

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {

            showToast(`✈️ ${data.message}`, 'success');

            loginFormElement.reset();
            clearAllErrors();

        } else {

            showToast(`⚠️ ${data.message}`, 'error');

        }

    } catch (error) {

        console.error(error);

        showToast(
            'Unable to connect to the server.',
            'error'
        );
    }
});
// ---- Registration Form Submit ----
registerFormElement.addEventListener('submit', async (e) => {

    e.preventDefault();

    if (!validateRegistration()) {
        return;
    }

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    try {

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {

            showToast(`✈️ ${data.message}`, 'success');

            registerFormElement.reset();
            clearAllErrors();

            setTimeout(() => {
                switchToLoginForm();
            }, 2000);

        } else {

            showToast(`⚠️ ${data.message}`, 'error');

        }

    } catch (error) {

        console.error(error);

        showToast(
            'Unable to connect to the server.',
            'error'
        );
    }
});
    // ---- Real-time validation clearing on input ----
    // Login fields
    document.getElementById('loginEmail').addEventListener('input', function() {
        clearFieldError('loginEmail', 'loginEmailError');
    });
    document.getElementById('loginPassword').addEventListener('input', function() {
        clearFieldError('loginPassword', 'loginPasswordError');
    });

    // Register fields
    document.getElementById('registerName').addEventListener('input', function() {
        clearFieldError('registerName', 'registerNameError');
    });
    document.getElementById('registerEmail').addEventListener('input', function() {
        clearFieldError('registerEmail', 'registerEmailError');
    });
    document.getElementById('registerPassword').addEventListener('input', function() {
        clearFieldError('registerPassword', 'registerPasswordError');
        // Also clear confirm error if they match now
        const confirm = document.getElementById('registerConfirm');
        const password = document.getElementById('registerPassword');
        if (confirm.value && password.value && confirm.value === password.value) {
            clearFieldError('registerConfirm', 'registerConfirmError');
        }
    });
    document.getElementById('registerConfirm').addEventListener('input', function() {
        const password = document.getElementById('registerPassword');
        if (this.value && password.value && this.value === password.value) {
            clearFieldError('registerConfirm', 'registerConfirmError');
        } else if (this.value) {
            // Show error if not matching while typing
            const err = document.getElementById('registerConfirmError');
            if (password.value && this.value !== password.value) {
                err.textContent = 'Passwords do not match.';
            } else {
                err.textContent = '';
            }
        } else {
            clearFieldError('registerConfirm', 'registerConfirmError');
        }
    });
    document.getElementById('termsCheck').addEventListener('change', function() {
        const err = document.getElementById('termsError');
        if (err) err.textContent = '';
    });

    // ---- Keyboard: Enter on switch links (accessibility) ----
    document.querySelectorAll('.switch-link').forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                link.click();
            }
        });
    });

    console.log('✈️ AeroBook ready — Your journey begins here.');
});