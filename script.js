const TIME_OUT = 600;
const VIDEO_DURATION = 11;
const TIMELINE_POINTS = [0, 3, 7, VIDEO_DURATION]; // timeline of animations
const TIMELINE_POINTS_REVERSE = TIMELINE_POINTS.map(
  (time) => VIDEO_DURATION - time
); // timeline of animations

HTMLVideoElement.prototype.playReverse = function (onended) {
  this.pause();
  let video = this;
  let fps = 24;
  let intervalRewind = setInterval(function () {
    if (video.currentTime <= 0) {
      clearInterval(intervalRewind);
      video.pause();
      onended();
    } else {
      video.currentTime -= 1 / fps;
    }
  }, 1000 / fps);
};

const body = document.querySelector("body");
const sectionsQty = document.querySelectorAll("section").length;
let startFlag = true;
let initialScroll = window.scrollY;
let qty = 1,
  main = null,
  next = null,
  videoEle = null,
  videoSecondPoint = 1,
  videoPlaying = false;
let touchStart = 0;

const onWindowScroll = () => {
  if (startFlag) {
    const unlockScroll = () => {
      initialScroll = this.scrollY;
      startFlag = true;
      body.style.overflowY = "scroll";
      console.log("un-locked");
    };

    const scrollDown = this.scrollY >= initialScroll;
    const scrollLimit = qty >= 1 && qty <= sectionsQty;

    if (scrollLimit) {
      body.style.overflowY = "hidden"; // Lock el scroll
      if (scrollDown && qty < sectionsQty) {
        main = document.querySelector(`section.s${qty}`);
        next = document.querySelector(`section.s${qty + 1}`);
        main.style.transform = "translateY(-100vh)";
        next.style.transform = "translateY(0)";
        videoEle = next.querySelector("#video-sticky");
        if (videoEle) {
          setTimeout(() => {
            videoPlaying = true;
          }, 400);
          videoEle.play();
          videoEle.onended = () => {
            videoPlaying = false;
            unlockScroll();
          };
        }
        qty++;
      } else if (!scrollDown && qty > 1) {
        main = document.querySelector(`section.s${qty - 1}`);
        next = document.querySelector(`section.s${qty}`);
        main.style.transform = "translateY(0)";
        next.style.transform = "translateY(100vh)";
        videoEle = main.querySelector("#video-sticky");
        if (videoEle) {
          setTimeout(() => {
            videoPlaying = true;
          }, 400);
          videoEle.playReverse(() => {
            videoPlaying = false;
            unlockScroll();
          });
        }
        qty--;
      }
    }

    if (!videoEle) {
      setTimeout(() => {
        unlockScroll();
      }, TIME_OUT);
    }
    startFlag = false;
    console.log("locked");
  }
};

let wheelEventEndTimeout = null;
//  prevent scroll event run on load
setTimeout(() => {
  window.addEventListener("mousewheel", (event) => {
    if (!videoPlaying) return;
    clearTimeout(wheelEventEndTimeout);
    wheelEventEndTimeout = setTimeout(() => {
      if (event.deltaY > 0) {
        console.log("scrolling down");
        const index = TIMELINE_POINTS.findIndex(
          (t) => t >= videoEle.currentTime + 0.2
        );
        if (index === -1) return;
        videoEle.currentTime = TIMELINE_POINTS[index];
      } else if (event.deltaY < 0) {
        console.log("scrolling up");
        const index = TIMELINE_POINTS_REVERSE.findIndex(
          (t) => t <= videoEle.currentTime + 0.2
        );
        if (index === -1) return;
        videoEle.currentTime = TIMELINE_POINTS_REVERSE[index];
      }
    }, 200);
  });
  window.addEventListener("touchstart", (event) => {
    if (!videoPlaying) return;
    touchStart = event.originalEvent.touches[0].clientY;
  });
  window.addEventListener("touchend", (event) => {
    if (!videoPlaying) return;
    var touchEnd = e.originalEvent.changedTouches[0].clientY;
    if (touchStart > touchEnd + 5) {
      console.log("scrolling down");
    } else if (touchStart < touchEnd - 5) {
      console.log("scrolling up");
    }
  });
  window.onscroll = onWindowScroll;
}, 500);
