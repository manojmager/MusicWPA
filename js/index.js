import MusicDB from './database.js'
$(document).ready(function () {
    init();
});
function init() {
    $("#add-song").on("click", btnAddSong_click);

    MusicDB.open()
        .then(() => {
            MusicDB.getSongList()
                .then(renderMusicList)
                .catch((error) => {
                    console.log('Error: ', error.message);
                })
        })
        .catch((error) => {
            console.log('Error: ', error.message);
        })
}
function renderMusicList(musics) {
    musics.forEach(data => {
        var listContent = $('<div>').addClass('music-item');

        var coverImg = $('<img>').attr({src: 'img/wave-sound.png',width: 50,height: 50});

        var listSongDetailContainer = $('<div>').addClass('song-details');
        var titleList = $('<p>').addClass('song-title').text(data.title);
        var artistList = $('<p>').addClass('artist').text(data.artist);

        var likesContainer = $('<div>').addClass('likes-container');
        var likeCounts = $('<p>').addClass('like-counts').text(data.likes + " likes");

        var btnActionContent = $('<div>').addClass('action-buttons');
        var btnLike = $('<button>').addClass('like-button').text("Like");
        var btnDelete = $('<button>').addClass('delete-button').text("Delete");

        // Append elements to their respective containers
        listSongDetailContainer.append(titleList, artistList);
        likesContainer.append(likeCounts);
        btnActionContent.append(btnLike, btnDelete);
        listContent.append(coverImg, listSongDetailContainer, likesContainer, btnActionContent);

        var likes = data.likes;
        btnLike.on("click", function () {
            likes = likes + 1;
            likeCounts.text(likes + " likes");
            MusicDB.updataLikeCounts({ "id": data.id, "likes": likes });
        });

        btnDelete.on("click", function () {
            MusicDB.deleteSong(data.id)
                .then(() => {
                    listContent.remove();
                })
                .catch((error) => {
                    console.log('Error deleting song: ', error.message);
                });
        });

        $('#list-song-container').append(listContent);
    });

}

function btnAddSong_click() {
    var title = $("#title").val();
    var artist = $("#artist").val();
    var likes = 0;

    if (title !== "" && artist !== "") {
        $("#title").val("");
        $("#artist").val("");
        $("#title").removeClass('msg');
        $("#artist").removeClass('msg');

        MusicDB.addSong(title, artist, likes)
            .then((newSongId) => {
                // Fetch the newly added song and append it to the list
                MusicDB.getSongList()
                    .then((newSongs) => {
                        // Find the newly added song by its ID
                        const newSong = newSongs.find(song => song.id === newSongId);
                        if (newSong) {
                            renderMusicList([newSong]);
                            $("#message-box").addClass('display-message-box');
                            setTimeout(function () {
                                $("#message-box").removeClass('display-message-box');
                            }, 1500);
                        } else {
                            console.log('Newly added song not found in the list.');
                        }
                    })
                    .catch((error) => {
                        console.log('Error: ', error.message);
                    });
            })
            .catch((error) => {
                console.log('Error : ', error.message);
            });
    }
    else {
        if (title == "" && artist !== "") {
            $("#title").addClass('msg');
        } else if (artist == "" && title !== "") {
            $("#artist").addClass('msg');
        } else {
            $("#title").addClass('msg');
            $("#artist").addClass('msg');
        }
    }
}