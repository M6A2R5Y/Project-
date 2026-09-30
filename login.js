document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
                alert('Login successful!');
                window.location.href = 'Bliss autos.html';
            } else {
                alert('Login failed: Token not received.');
            }
        } else {
            const errorText = await response.text();
            alert('Login failed: ' + errorText);
        }
    })
    .catch(err => {
        console.error('Connection error:', err);
        alert('Could not connect to the server. Please ensure the backend is running.');
    });
});