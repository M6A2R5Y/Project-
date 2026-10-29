document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const feedback = document.getElementById('login-feedback');
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
                    if (feedback) {
                        feedback.style.display = 'block';
                        feedback.style.backgroundColor = '#dcfce7';
                        feedback.style.color = '#166534';
                        feedback.textContent = 'Login successful. Redirecting to dashboard...';
                    }
                    setTimeout(() => {
                        window.location.href = 'Dashboard.html';
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
                feedback.textContent = msg;
            } else {
                alert(msg);
            }
        }
    });
});
