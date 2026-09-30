document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(async response => {
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            const errorText = await response.text();
            alert('Registration failed: ' + errorText);
        }
    })
    .catch(err => {
        console.error('Connection error:', err);
        alert('Could not connect to the server. Please ensure the backend is running.');
    });
});