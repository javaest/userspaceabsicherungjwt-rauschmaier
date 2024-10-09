document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // API-Aufruf an das Backend zur Anmeldung
    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
     .then(response => {
        console.log('Response Status:', response.status); // Statuscode in der Konsole ausgeben
        return response.json().then(data => {
            console.log('Response Data:', data);
            return { data, status: response.status }; // Beide Werte zurückgeben
        });
    })
    .then(({ data, status }) => {
    if (status !== 200) {
        throw new Error(data.message || 'Anmeldung fehlgeschlagen');
    }
    // Erfolgreiche Anmeldung
    document.getElementById('message').innerText = `Willkommen, ${data.username}!`;

    // Speichern des Benutzernamens im localStorage
    localStorage.setItem('username', data.username);
	console.log('Username gespeichert:', localStorage.getItem('username'));
    // Weiterleitung zur Lernplattform-Seite
    window.location.href = 'index.html'; // Ändere den Dateinamen entsprechend deiner Struktur
})
    .catch(error => {
        console.error('Error:', error); // Fehler in der Konsole ausgeben
        document.getElementById('message').innerText = error.message;
    });
});