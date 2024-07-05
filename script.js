document.addEventListener('DOMContentLoaded', async () => {
  const stringForm = document.getElementById('stringForm');
  const stringInput = document.getElementById('stringInput');
  const stringListElement = document.getElementById('stringList');

  let String1, String2, String3, String4, String5;

  // Funktion zum Laden aller Strings und Aktualisieren der Variablen
  async function loadStrings() {
    try {
      const response = await fetch('/get-strings');
      const data = await response.json();
      stringListElement.innerHTML = '';
      data.forEach((string, index) => {
        const li = document.createElement('li');
        li.textContent = `String ${index + 1}: ${string}`;
        stringListElement.appendChild(li);
      });

      // Aktualisiere die Variablen
      String1 = data[0] || null;
      String2 = data[1] || null;
      String3 = data[2] || null;
      String4 = data[3] || null;
      String5 = data[4] || null;

      console.log('Aktuelle Strings:', { String1, String2, String3, String4, String5 });

      return data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Strings:', error);
    }
  }

  // Initial alle Strings laden
  await loadStrings();

  // Event-Listener für das Formular
  stringForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = stringInput.value;

    try {
      await fetch('/save-string', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      stringInput.value = '';
      await loadStrings();
    } catch (error) {
      console.error('Fehler beim Speichern des Strings:', error);
    }
  });
});
