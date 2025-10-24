/**
 * Nhiem vu :

 * 8, Active song
 * 9, Scroll activesong in to view
 * 10, Play song when click
 * 11, acr volume
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PlAYER_STORAGE_KEY = 'MUSIC_PLAYER_CONFIG'
const cdThumb = $('.cd-thumb')
const title = $('header h2')
const singer = $('header #singer')
const playlist = $('.playlist')
const player = $('.player')
const audio = $('#audio')
const progress = $('#progress')
const cdWidth = cdThumb.offsetWidth
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
let isPlaying = false
let isRandom = false
let isRepeat = false
const cdAnimation = cdThumb.animate([{transform: "rotate(0deg)"},{transform: "rotate(360deg"}], {duration:10000, iterations: Infinity})

const app = {
  
    currentIndex : 0,
    songs: [
    {
      name: "Kỵ sĩ và ánh sao",
      singer: "Đông Nhi",
      path: "./assets/musics/KSVAS.mp3",
      image: "./assets/images/KSVAS.jpg"
    },
    {
      name: "Tìm lại bầu trời",
      singer: "Tuấn Hưng",
      path: "./assets/musics/TLBT.mp3",
      image: "./assets/images/TLBT.jpg"
    },
    {
      name: "[OST CONAN MOVIE 27]",
      singer: "Soushi Souai - aiko",
      path: "./assets/musics/DC27.mp3",
      image: "./assets/images/DC27.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path:
        "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],
    config:{},
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
    displayActiveSong : function(){
      const _this = this
      const playlistSong = $$('.playlist .song')
      playlistSong.forEach(function(song, index){
        if(index === _this.currentIndex ){
          song.classList.add('active')
          song.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }
        else{
          song.classList.remove('active')
        }
      })
    },
  //render bai hat dang chay
    loadCurrentSong : function(){
        player.classList.remove('playing')
        isPlaying = false
        title.innerText = `${this.songs[this.currentIndex].name}`
        singer.innerText = `${this.songs[this.currentIndex].singer}`
        cdThumb.style.backgroundImage = `url('${this.songs[this.currentIndex].image}')`
        audio.src = `${this.songs[this.currentIndex].path}`
        if(playlist.innerHTML !== ''){
          this.displayActiveSong()
        }
  },
  //render play list ra man hinh
    renderPlaylist: function(){
        
        https = this.songs.map(function(song){
            return `  
        <div class = 'song'>
        <div class = 'thumb',
         style = 'background-image: url("${song.image}")'></div>
        <div class="body">
            <h3 class = 'title'>${song.name} </h3>
            <p class = 'author'>${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>
        `
        })
        playlist.innerHTML = https.join(' ')

  },

  handleEvents : function(){
    const _this = this
    //xu li cuon trang
    window.onscroll = function(){
      const scrollTop = window.scrollY|| document.documentElement.scrollTop
      const cdNewWidth = (cdWidth - scrollTop) > 0 ? (cdWidth-scrollTop) + 'px' : 0 + 'px'
      cdThumb.style.width = cdNewWidth
      cdThumb.style.paddingTop = cdNewWidth
      cdThumb.style.opacity = (cdWidth - scrollTop)/cdWidth
    }
    // xu li nut play
    playBtn.onclick = function(){
      if(!isPlaying){
        player.classList.add('playing')
        isPlaying = true
        audio.play()
        cdAnimation.play()
      }
      else{
        player.classList.remove('playing')
        isPlaying = false
        audio.pause()
        cdAnimation.pause()
      }
    }
    //xu li audio
    audio.ontimeupdate =function(){
      if(audio.duration){
        const progressPercent = Math.floor((audio.currentTime/audio.duration)*100)
        progress.value = progressPercent
      }
    }
    progress.onchange = function(e){
      console.log(e.target.value)
      const seekTime = e.target.value / 100 * audio.duration 
      audio.currentTime = seekTime
    }
    audio.onended = function(){
      if(isRepeat){
        audio.play()
      }
      else if(isRandom){
        let newIndex 
        do{
          newIndex = Math.floor(Math.random() * _this.songs.length)
        }while(newIndex === _this.currentIndex)
        _this.currentIndex = newIndex
        _this.loadCurrentSong()
        player.classList.add('playing')
        isPlaying = true
        audio.play()
      }
      else{
        nextBtn.click()
      }
    }
    //xu li nut next/prev
    nextBtn.onclick = function(){
      _this.currentIndex++
      if(_this.currentIndex >= _this.songs.length){
        _this.currentIndex = 0
      }
      _this.loadCurrentSong()
      player.classList.add('playing')
      isPlaying = true
      audio.play()
    }
    prevBtn.onclick = function(){
      _this.currentIndex--
      if(_this.currentIndex < 0){
        _this.currentIndex = _this.songs.length - 1
      }
      _this.loadCurrentSong()
      player.classList.add('playing')
      isPlaying = true
      audio.play()
    }
    //xu li nur random
    randomBtn.onclick = function(){
      isRandom = !isRandom
      _this.setConfig("isRandom", _this.isRandom)
      randomBtn.classList.toggle('active', isRandom)
    }

    //xu li nut repeat
    repeatBtn.onclick = function(){
      isRepeat = !isRepeat
      _this.setConfig("isRepeat", _this.isRepeat)
      repeatBtn.classList.toggle('active', isRepeat)
    }
    //Chon bai
    const songElements = $$('.playlist .song')
    songElements.forEach(function(songElement,index){
      songElement.onclick = function(){
        _this.currentIndex = index
        _this.loadCurrentSong()
        player.classList.add('playing')
        isPlaying = true
        audio.play()
        cdAnimation.play()
      }
    })
  },
  loadConfig: function () {
    const PlAYER_STORAGE_KEY = 'MUSIC_PLAYER_CONFIG';
    this.config = JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {};
    this.isRandom = this.config.isRandom ?? false;
    this.isRepeat = this.config.isRepeat ?? false;
  },
  



  //ham khoi dong
    start : function(){
        cdAnimation.pause()
        this.loadConfig()
        this.renderPlaylist()        
        this.loadCurrentSong()      
        this.handleEvents() 
  }
}

app.start()