document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // API-Aufruf an das Backend zur Anmeldung
    fetch('http://localhost:8080/api/auth/signin', {
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
    localStorage.setItem('token', data.accessToken);
	console.log('Username gespeichert:', localStorage.getItem('username'));
    // Weiterleitung zur Lernplattform-Seite
    window.location.href = 'index.html'; // Ändere den Dateinamen entsprechend deiner Struktur
})
    .catch(error => {
        console.error('Error:', error); // Fehler in der Konsole ausgeben
        document.getElementById('message').innerText = error.message;
    });
});

// auth.js
// Überprüfen, ob der Benutzer angemeldet ist und ob der JWT-Token gültig ist
window.onload = function() {
    const token = localStorage.getItem('token');
    console.log('Geladener JWT-Token:', token); 

    if (!token) {
        // Token ist nicht vorhanden, zurück zur Anmeldeseite leiten
        window.location.href = 'login.html'; // Ändere den Dateinamen entsprechend deiner Struktur
        return;
    }

    // Token an den Test-Endpoint senden
    fetch('http://localhost:8080/api/test/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            // Wenn der Status 200 ist, bleibt der Benutzer auf der Seite
            console.log('Token validiert, Zugriff gewährt.');
        } else {
            // Wenn der Status nicht 200 ist, zurück zur Anmeldeseite leiten
            console.error('Token ungültig, zurück zur Anmeldeseite.');
            window.location.href = 'login.html'; // Ändere den Dateinamen entsprechend deiner Struktur
        }
    })
    .catch(error => {
        console.error('Fehler bei der Token-Validierung:', error);
        window.location.href = 'login.html'; // Ändere den Dateinamen entsprechend deiner Struktur
    });
};

function logout() {
    localStorage.removeItem('jwtToken'); // Entferne den JWT-Token aus dem localStorage
    window.location.href = 'login.html'; // Zur Anmeldeseite leiten
}
