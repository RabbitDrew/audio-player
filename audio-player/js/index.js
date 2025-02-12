const page = document.querySelector(".page"),
  cover = document.querySelector(".cover-img"),
  title = document.querySelector('.dispaly-title'),
  // controls btns
  backward = document.querySelector(".backward"),
  playAndPouse = document.querySelector(".play_pause"),
    playAndPauseBtnImg = document.querySelector('.play_img'),
  forward = document.querySelector(".forward"),
  // audio
  audio = document.querySelector(".audio"),
  /*progress bar*/
  progressBarWrapper = document.querySelector('.progress-bar__wrapper'),
  progressBar = document.querySelector('.progress-bar'),
  /*sound bar*/
  volumeBtn = document.querySelector('.display-volume__wrapper'),
  volumeBar = document.querySelector('.volume-level__wrapper'),
  volumeLevel = document.querySelector('.volume-level'),
  /*song timer*/
  currSongTime = document.querySelector('.curr-time'),
  fullSongTime = document.querySelector('.full-time')


let isSongPlay = false
//data
const dataMusic = [
                    "Kyle_Watson_You_Boy_ft_Kylah_Jasmine",
                     "dontstartnow",
                     "beyonce",
];

const dataCovers = [
                    "Kyli_Watson.jpg",
                    "dontstartnow.png",
                    "lemonade.png"
]

const titlesArr = [
    "Kyle Watson ft Kylah Jasmine - You Boy",
    "Dua Lipa -  don't start now",
    "Beyonce - lemonade"
]


/*timer*/
const getFullTimeSong = function () {
    const songDuration = audio.duration; 
    const minutes = Math.floor(songDuration / 60); 
    const seconds = Math.floor(songDuration % 60); 
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    fullSongTime.textContent = `${formattedMinutes}:${formattedSeconds}`;
} 
getFullTimeSong()


function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    currSongTime.textContent = `${formattedMinutes}:${formattedSeconds}`;
}


audio.addEventListener('loadedmetadata', () => {
    getFullTimeSong();
});

audio.addEventListener('timeupdate', () => {
     formatTime(audio.currentTime);
});



let index = 0
const initSong = function () {
    page.style.setProperty('--bg-image', `url('../assets/img/${dataCovers[index]}')`);
    audio.src = `./assets/audio/${dataMusic[index]}.mp3`
    cover.src = `./assets/img/${dataCovers[index]}`
    title.textContent = `${titlesArr[index]}`
}
initSong()

const playAudio = function () {
    isSongPlay = true
    playAndPauseBtnImg.src='./assets/control_btns/pause.png'
    audio.play()
}

const pauseAudio = function () {
    isSongPlay = false
    playAndPauseBtnImg.src='./assets/control_btns/play.png'
    audio.pause()
}

const prevSong = function () {
    if (index >0) {
        index--
    } else {
        index = dataMusic.length-1
    }
}

backward.addEventListener('click', () => {
    prevSong()
    initSong()
    audio.addEventListener('loadedmetadata', getFullTimeSong);
    playAudio()

})

playAndPouse.addEventListener('click', () => {
    if(!isSongPlay) {
        playAudio()
    }else {
        pauseAudio()
    }
})


const nextSong = function () {
    if (index < dataMusic.length-1 && index < dataCovers.length-1) {
        index++
    } else {
        index = 0
    }
}

forward.addEventListener('click', () => {
    nextSong()
    initSong()
    audio.addEventListener('loadedmetadata', getFullTimeSong);
    playAudio()
    
})


/*progress bar*/
const activeProgressBar = function () {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percentage + '%'; 
}

audio.addEventListener('timeupdate', () => {
    activeProgressBar ()
});



/*fast forwording*/
const fastForward = function(event) {
    const barWrapperLength = progressBarWrapper.getBoundingClientRect();
    const pointCoordinates = event.clientX - barWrapperLength.left;
    const totalWidth = barWrapperLength.width;
    const percentage = Math.min(Math.max(pointCoordinates / totalWidth, 0), 1); 
    audio.currentTime = percentage * audio.duration; 
    activeProgressBar(); 
};

progressBarWrapper.addEventListener('click', fastForward);

let isDragging = false;

progressBarWrapper.addEventListener('mousedown', (event) => {
    isDragging = true;
    audio.muted = true; 
    fastForward(event);
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        audio.muted = false; 
    }
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        fastForward(event); 
    }
});
/***************************************************************************/



/*autoplay*/
audio.addEventListener('ended', ()=> {
    nextSong()
    initSong()
    playAudio()
})



/*change volume level*/
/*close open bar*/
let barIsOpen = false 
const openCloseBar = function () {
    if (!barIsOpen) {
      volumeBar.classList.remove('hide__volume')
      barIsOpen = true
    }else {
        volumeBar.classList.add('hide__volume')
        barIsOpen = false
    }
}
volumeBtn.addEventListener('click', ()=> {
    openCloseBar()
})



/*volume dragging func*/
const changeVolumeProgress = function (event) {
    const barRect = volumeBar.getBoundingClientRect(); 
    const pointCoordinates = event.clientY - barRect.top; 
    const totalHeight = barRect.height;

    let volume = 1 - (pointCoordinates / totalHeight); 
    volume = Math.min(Math.max(volume, 0), 1); 

    audio.volume = volume; 
    volumeLevel.style.height = (volume * 100) + '%';
}


let isDraggingVol = false;

volumeBar.addEventListener('mousedown', (event) => {
    isDraggingVol = true;
    changeVolumeProgress(event);
});

document.addEventListener('mouseup', () => {
    if (isDraggingVol) {
        isDraggingVol = false;
    }
});
document.addEventListener('mousemove', (event) => {
    if (isDraggingVol) {
        changeVolumeProgress(event); 
    }
});
volumeBar.addEventListener('click', (event) => {
    changeVolumeProgress(event);
});

/***************************************************************************/