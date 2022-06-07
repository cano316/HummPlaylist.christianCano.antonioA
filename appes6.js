class Song {
    constructor(songTitle, artist) {
        this.songTitle = songTitle;
        this.artist = artist;
    }
}

class UI {
    addSongToPlaylist(song) {
        const playlist = document.getElementById
            ('play-list');
        // Create tr element
        const row = document.createElement('tr');

        //Apply class to row

        // row.classList.add('tableStyles')
        //Insert Columns
        // row.innerHTML = `
        // <td>${song.songTitle}</td>
        // <td>${song.artist}</td>
        // <td><a href="#" class="delete">X<a></td>
        // `;
        row.innerHTML = `
        <td>${song.songTitle}</td>
        <td>${song.artist}</td>
        <td><i class="fa-solid fa-trash-can delete"></i></td>
        `;
        playlist.appendChild(row);
    }
    showAlert(message, className) {
        //Create div
        const div = document.createElement('div');
        //Add classes
        div.className = `alert ${className}`;
        //Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        //Get form
        const form = document.querySelector('#playlist-form')
        //Insert alert
        container.insertBefore(div, form);

        //Timeout after 3 seconds
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 2000);
    }
    deleteSong(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }
    clearFields() {
        document.getElementById('songTitle').value = '';
        document.getElementById('artist').value = '';
    }
    clearList() {
        const tbody = document.querySelector('#play-list');
        tbody.innerHTML = '';
    }

}

// Local Storage Class
class Storage {
    static getSongs() {
        let songs;
        if (localStorage.getItem('songs') === null) {
            songs = [];
        } else {
            songs = JSON.parse(localStorage.getItem('songs'));
        }
        return songs;
    }

    static displaySong() {
        const songs = Storage.getSongs();

        songs.forEach(song => {
            const ui = new UI;

            // Add song to ui
            ui.addSongToPlaylist(song);
        });
    }

    static addSong(song) {
        const songs = Storage.getSongs();

        songs.push(song);

        localStorage.setItem('songs', JSON.stringify(songs));
    }

    static removeSong(songTitle) {
        const songs = Storage.getSongs();

        songs.forEach(function (song, index) {
            if (song.songTitle === songTitle) {
                songs.splice(index, 1);
            }
        });

        localStorage.setItem('songs', JSON.stringify(songs));
    }

    static clearSongs() {
        localStorage.clear();
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Storage.displaySong);

//Event Listener for add song
document.getElementById('playlist-form')
    .addEventListener('submit', function (e) {
        // Get form values
        const songTitle = document.getElementById('songTitle').value,
            artist = document.getElementById
                ('artist').value
        //Instantiate book
        const song = new Song(songTitle, artist);

        //Instantiate UI
        const ui = new UI();

        // Validate
        if (songTitle === '' || artist === '') {
            //Error alert
            ui.showAlert('Please fill out all fields', 'error');
        } else {
            // Add song to playlist
            ui.addSongToPlaylist(song);

            // Add to local storage
            Storage.addSong(song);

            //Show success
            ui.showAlert('Song Added', 'success');

            // Clear fields
            ui.clearFields();
        }
        e.preventDefault();
    });

// Event Listener for delete
document.getElementById('play-list')
    .addEventListener('click', function (e) {

        // Instantiate UI
        const ui = new UI();

        // Delete song
        ui.deleteSong(e.target);
        // Remove from local storage
        Storage.removeSong(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

        // Show message
        ui.showAlert('Song Removed!', 'success');

        e.preventDefault();
    });

// Event Listener for clear button

const clearButton = document.querySelector('#clearButton')

clearButton.addEventListener('click', function (e) {
    e.stopPropagation();
    if (confirm('Are you sure you would like to clear the playlist?') == true) {
        //Clear local storage
        Storage.clearSongs();

        //instantiate UI

        const ui = new UI();

        // Clear the playlist

        ui.clearList();

        // Show alert

        ui.showAlert('Successfully cleared playlist', 'success')
    }
})

//come back to this