document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const feedback = document.getElementById('login-feedback');
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');

    if (feedback && reason) {
        if (reason === 'auth_required') {
            feedback.style.display = 'block';
            feedback.style.backgroundColor = '#eff6ff';
            feedback.style.color = '#1e40af';
            feedback.style.border = '1px solid #bfdbfe';
            feedback.textContent = 'Dealership Portal Access: Authentication required. Please sign in with your authorized credentials.';
        } else if (reason === 'signed_out') {
            feedback.style.display = 'block';
            feedback.style.backgroundColor = '#f0fdf4';
            feedback.style.color = '#166534';
            feedback.style.border = '1px solid #bbf7d0';
            feedback.textContent = 'You have been signed out successfully.';
        } else if (reason === 'session_expired') {
            feedback.style.display = 'block';
            feedback.style.backgroundColor = '#fffbeb';
            feedback.style.color = '#92400e';
            feedback.style.border = '1px solid #fde68a';
            feedback.textContent = 'Your session has expired. Please sign in again to continue.';
        }
    }

    if (!loginForm) return;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('login-btn');

        if (feedback) {
            feedback.style.display = 'none';
            feedback.textContent = '';
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';
        }

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(async response => {
            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userEmail', email);
                    if (data.name) {
                        localStorage.setItem('userName', data.name);
                    }
                    if (feedback) {
                        feedback.style.display = 'block';
                        feedback.style.backgroundColor = '#dcfce7';
                        feedback.style.color = '#166534';
                        feedback.style.border = '1px solid #bbf7d0';
                        feedback.textContent = 'Login successful. Redirecting to portal...';
                    }
                    const redirectUrl = urlParams.get('redirect') || 'Dashboard.html';
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 800);
                } else {
                    showError('Login failed: Authentication token not received.');
                }
            } else {
                const errorText = await response.text();
                showError(errorText || 'Authentication failed. Please verify your email and password.');
            }
        })
        .catch(err => {
            console.error('Connection error:', err);
            showError('Could not reach backend service. If running locally, please start the backend server.');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });

        function showError(msg) {
            if (feedback) {
                feedback.style.display = 'block';
                feedback.style.backgroundColor = '#fee2e2';
                feedback.style.color = '#991b1b';
                feedback.style.border = '1px solid #fecaca';
                feedback.textContent = msg;
            } else {
                alert(msg);
            }
        }
    });
});
