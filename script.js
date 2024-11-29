// Funzione per effettuare una richiesta API e popolare una sezione della pagina
function fetchData(url, sectionId) {
    fetch(url) // Effettua una richiesta HTTP al server
      .then(function (response) {
        console.log("Chiamata a " + url + " con status: " + response.status); // Mostra lo stato della richiesta
        if (response.ok) {
          return response.json(); // Converte la risposta in JSON
        } else {
          console.error("Errore nella chiamata a " + url); // Log di errore in caso di risposta non valida
          return null; // Restituisce null in caso di errore
        }
      })
      .then(function (data) {
        if (data) {
          console.log("Dati ricevuti per " + sectionId, data); // Mostra i dati ricevuti nella console
          populateSection(data.data, sectionId); // Chiama la funzione per popolare la sezione con i dati ricevuti
        }
      })
      .catch(function (error) {
        console.error("Errore nella fetch: ", error); // Log di errore in caso di problemi con la fetch
      });
  }
  
  // Funzione per popolare una sezione con un massimo di 4 canzoni
  function populateSection(songs, sectionId) {
    var section = document.getElementById(sectionId); // Trova la sezione nel DOM
    if (!section) {
      console.error("Elemento con ID " + sectionId + " non trovato."); // Mostra un errore se la sezione non esiste
      return; // Interrompe l'esecuzione se la sezione non è trovata
    }
  
    section.innerHTML = ""; // Svuota la sezione prima di aggiungere nuovi contenuti
  
    // Itera sui primi 4 brani (o meno se ce ne sono meno di 4)
    for (var i = 0; i < Math.min(songs.length, 4); i++) {
      var song = songs[i]; // Ottieni il brano corrente
      var songCard = document.createElement("div"); // Crea un elemento div per la card
      songCard.className = "col mb-4"; // Aggiungi classi di Bootstrap per layout e spaziatura
  
      // HTML della card
      songCard.innerHTML =
        '<div class="card h-100 bg-dark text-white">' +
        '<img src="' + song.album.cover_medium + '" class="card-img-top" alt="' + song.title + '" />' +
        '<div class="card-body">' +
        '<h5 class="card-title text-truncate">' + song.title + '</h5>' +
        '<p class="card-text text-truncate">Artist: ' + song.artist.name + '</p>' +
        '</div></div>';
  
      section.appendChild(songCard); // Aggiungi la card alla sezione
    }
  
    // Rimuovi la classe "d-none" per rendere visibile la sezione
    section.parentElement.classList.remove("d-none");
    console.log("Sezione " + sectionId + " visibile."); // Log di conferma
  }
  
  // Funzione per caricare i dati di tutte le sezioni
  function loadAllData() {
    console.log("Caricamento dati per le sezioni..."); // Log di inizio caricamento
    // Chiamate API per gli artisti Eminem, Metallica e Queen
    fetchData("https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem", "eminemSection");
    fetchData("https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica", "metallicaSection");
    fetchData("https://striveschool-api.herokuapp.com/api/deezer/search?q=queen", "queenSection");
  }
  
  // Evento per caricare i dati quando la pagina è pronta
  document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript caricato correttamente"); // Log di avvio
    loadAllData(); // Carica i dati di tutte le sezioni
  });
  
  // Funzione per raccogliere i titoli degli album dagli API
  function fetchAlbumTitles() {
    var urls = [
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem",
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica",
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=queen"
    ];
  
    var albumTitles = []; // Array per raccogliere i titoli degli album
  
    // Esegui tutte le richieste fetch in parallelo
    Promise.all(
      urls.map(function (url) {
        return fetch(url) // Effettua la richiesta per ciascun URL
          .then(function (response) {
            return response.json(); // Converte la risposta in JSON
          })
          .then(function (data) {
            // Itera sui brani ricevuti e raccoglie i titoli degli album
            for (var i = 0; i < data.data.length; i++) {
              var title = data.data[i].album.title; // Ottieni il titolo dell'album
              if (albumTitles.indexOf(title) === -1) { // Controlla se il titolo non è già stato aggiunto
                albumTitles.push(title); // Aggiungi il titolo all'array
              }
            }
          })
          .catch(function (error) {
            console.error("Errore durante la fetch da " + url + ": ", error); // Log di errore in caso di problemi
          });
      })
    ).then(function () {
      // Dopo che tutte le fetch sono completate, mostra i titoli nel modale
      showAlbumList(albumTitles); // Passa i titoli raccolti alla funzione per mostrarli
    });
  }
  
  // Funzione per mostrare i titoli degli album nel modale
  function showAlbumList(albumTitles) {
    var albumList = document.getElementById("albumList"); // Trova l'elemento della lista nel modale
    albumList.innerHTML = ""; // Svuota la lista precedente
  
    // Aggiungi ogni titolo alla lista
    for (var i = 0; i < albumTitles.length; i++) {
      var listItem = document.createElement("li"); // Crea un elemento <li> per ogni titolo
      listItem.className = "list-group-item"; // Aggiungi classi Bootstrap per lo stile
      listItem.textContent = albumTitles[i]; // Assegna il titolo dell'album come testo
      albumList.appendChild(listItem); // Aggiungi l'elemento alla lista
    }
  
    // Mostra il modale utilizzando Bootstrap
    var albumListModal = new bootstrap.Modal(document.getElementById("albumListModal"));
    albumListModal.show(); // Mostra il modale
  }
  
  // Aggiungi l'evento click al pulsante "Crea Lista"
  document.getElementById("createListBtn").addEventListener("click", fetchAlbumTitles);
  