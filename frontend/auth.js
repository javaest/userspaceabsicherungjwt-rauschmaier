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
