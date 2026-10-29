document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const feedback = document.getElementById('register-feedback');
        const submitBtn = document.getElementById('register-btn');

        if (password.length < 6) {
            showError('Password must contain at least 6 characters.');
            return;
        }

        if (feedback) {
            feedback.style.display = 'none';
            feedback.textContent = '';
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
        }

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(async response => {
            if (response.ok) {
                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.style.backgroundColor = '#dcfce7';
                    feedback.style.color = '#166534';
                    feedback.textContent = 'Account created successfully! Redirecting to login...';
                }
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                const errorText = await response.text();
                showError(errorText || 'Registration failed. Email may already be registered.');
            }
        })
        .catch(err => {
            console.error('Connection error:', err);
            showError('Could not reach backend service. Please check your network connection.');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register Account';
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
