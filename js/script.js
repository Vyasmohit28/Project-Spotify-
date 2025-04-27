console.log('let begin the coding');
let currentsong = new Audio();
const progress = document.querySelector('.progress');
const circle = document.querySelector('.circle');
let songs;
let curretFolder;
let autoPlay;
let selectFolder;
let as;


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getSongs(folder) {
    curretFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    as = div.getElementsByTagName("a")
    console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        let element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1].split("(")[0].split("/")[1])

        }
    }

    let songsUL = document.querySelector(".left-side-content-box").getElementsByTagName("ul")[0];
    songsUL.innerHTML = ""

    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `  <li class="flex li-oprate"> 
                                <div class="music-img invert">
                                    <img src="/svgs/music-img.svg" alt="">
                                </div>
                                <div class="song-info">
                                    <div class="song-name">${song.replaceAll("_", " ")}</div>
                                </div>
                                <div class="left-side-play-button invert">
                                    <img src="/svgs/play-button.svg" alt="">
                                </div>
        </li>`
    }
    //targeting the music for playing songs
    Array.from(document.querySelector(".left-side-content-box").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".song-info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.replaceAll(" ", "_"));
        })

    })
}

let playMusic = (track) => {
    // to play a songs
    autoPlay = track;

    // console.log("songs" + `/${curretFolder}/` + track + "(256k).mp3");

    currentsong.src = ("songs" + `/${curretFolder}/` + track + "(256k).mp3")
    currentsong.play();
    play.src = "/svgs/pause.svg"
    let show_music = track.replaceAll("_", " ")
    document.querySelector(".show-music-in-playbar").innerHTML = show_music;

    // event on clicking next button

    let nextbutton = document.querySelector("#next");
    nextbutton.addEventListener("click", () => {
        let index
        for (i = 0; i <= songs.length; i++) {
            index = songs.indexOf(track);
        }
        // console.log(index);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[0])
        }

    })



    // event on clicking previous button
    let previousbutton = document.querySelector("#previous");
    previousbutton.addEventListener("click", () => {
        let index;

        for (i = 0; i <= songs.length; i++) {
            index = songs.indexOf(track);
        }

        // console.log(index - 1);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
        else {
            playMusic(songs[songs.length - 1]);
        }
    })
}


async function getAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let cardContent = document.querySelector(".cardContent");
    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let albums = e.href.split("/").slice(-2)[0];
        
            //get the metadata of albums
            let a = await fetch(`http://127.0.0.1:3000/songs/${albums}/info.json`)
            let response = await a.json();
            console.log(response);

            cardContent.innerHTML = cardContent.innerHTML + `
                         <div class="cardContainer">
                        <img src="/songs/${albums}/Cover.jpg" alt="">
                        <h4>${response.title}</h4>
                        <p class="invert-light">${response.description}</p>
                        <div class="play-icon" >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("cardContainer")).forEach(e => {
        e.addEventListener("click", async () => {
            // console.log(e.childNodes[3].innerHTML);
            selectFolder = e.childNodes[3].innerHTML;
            await getSongs(`${e.childNodes[3].innerHTML}`)
            playMusic(songs[0])
        })
    });

    let showall = false;
    document.querySelector(".showall").addEventListener("click", () => {
        if (showall == false) {
            document.querySelector(".cardContent").style.height = "100%"
            showall = true;
        }
        else {
            document.querySelector(".cardContent").style.height = ""
            showall = false;
        }
    })

}

async function main() {

    songs = await getSongs("KK")
    // to display all the folder in the page
    getAlbums();

    //play and pause functionality
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "/svgs/pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "/svgs/playbutton.svg"
        }
    })
    // current time and total time and seek bar
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".current-time").innerHTML = formatTime(currentsong.currentTime)
        document.querySelector(".total-time").innerHTML = formatTime(currentsong.duration)


        // play songs withour click
        if (currentsong.currentTime == currentsong.duration) {
            for (i = 0; i <= songs.length; i++) {
                index = songs.indexOf(autoPlay);
            }
            // console.log(index);
            if (index + 1 < songs.length) {
                playMusic(songs[index + 1])
            }
        }


    })

    // Update the seek bar as the audio plays
    currentsong.addEventListener('timeupdate', () => {
        // console.log(currentsong.currentTime);
        // console.log(currentsong.duration);
        const progressPercentage = (currentsong.currentTime / currentsong.duration) * 100;
        // console.log(progressPercentage);
        progress.style.width = `${progressPercentage}%`;
        circle.style.left = `${progressPercentage}%`;
    });

    const seekBar = document.querySelector('.seek-bar');

    seekBar.addEventListener('click', (e) => {
        const rect = seekBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const clickPosition = offsetX / seekBar.clientWidth;
        currentsong.currentTime = clickPosition * currentsong.duration;
    });


    let hamburger = document.querySelector(".hamburger");
    let hamburger_1 = document.querySelector(".hamburger-1");

    hamburger.addEventListener("click", () => {
        document.querySelector(".container1").setAttribute("style", "left: 0vw;");
    })
    hamburger_1.addEventListener("click", () => {
        document.querySelector(".container1").setAttribute("style", "left: -120vw;");
    })

    volumeRange.addEventListener("change", (e) => {
        // console.log(parseInt(e.target.value)/100);

        currentsong.volume = parseInt(e.target.value) / 100
    })
    
}

main();


