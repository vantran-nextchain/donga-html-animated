const TIME_OUT = 600; // It should be the same transition time of the sections
const body = document.querySelector("body");
const sectionsQty = document.querySelectorAll("section").length;
let startFlag = true;
let initialScroll = window.scrollY;
let qty = 1,
  main = null,
  next = null,
  videoSticky = null;
const onWindowScroll = () => {
  // if (loading) return
  if (startFlag) {
    const unlockScroll = () => {
      initialScroll = this.scrollY;
      startFlag = true;
      body.style.overflowY = "scroll";
      console.log("un-locked");
    };
    const lockScroll = () => {
      startFlag = false;
      console.log("locked");
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
        videoSticky = next.querySelector("#video-sticky");
        if (videoSticky) {
          videoSticky.play();
          videoSticky.onended = () => {
            unlockScroll();
          };
        } else {
          setTimeout(() => {
            unlockScroll();
          }, TIME_OUT);
        }
        qty++;
      } else if (!scrollDown && qty > 1) {
        main = document.querySelector(`section.s${qty - 1}`);
        next = document.querySelector(`section.s${qty}`);
        main.style.transform = "translateY(0)";
        next.style.transform = "translateY(100vh)";
        videoSticky = main.querySelector("#video-sticky");
        if (videoSticky) {
          videoSticky.playBackwards(() => {
            unlockScroll();
          });
        } else {
          setTimeout(() => {
            unlockScroll();
          }, TIME_OUT);
        }
        qty--;
      }

      lockScroll();
    }
  }
  // // Keep scrollbar in the middle of the viewport
  // window.scroll(0, window.screen.height);
};
HTMLVideoElement.prototype.playBackwards = function (onended) {
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
setTimeout(() => {
  window.onscroll = onWindowScroll;
}, 500);
