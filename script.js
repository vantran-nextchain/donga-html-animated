const TIME_OUT = 600; // It should be the same transition time of the sections
const body = document.querySelector("body");
const sectionsQty = document.querySelectorAll("section").length;
let startFlag = true;
let initialScroll = window.scrollY;
let qty = 1,
  main = null,
  next = null,
  videoSticky = null,
  seenVideo = false;
const onWindowScroll = () => {
  // if (loading) return
  if (startFlag) {
    const scrollDown = this.scrollY >= initialScroll;
    const scrollLimit = qty >= 1 && qty <= sectionsQty;
    // Verify that the scroll does not exceed the number of sections
    if (scrollLimit) {
      body.style.overflowY = "hidden"; // Lock el scroll
      if (scrollDown && qty < sectionsQty) {
        main = document.querySelector(`section.s${qty}`);
        next = document.querySelector(`section.s${qty + 1}`);
        main.style.transform = "translateY(-100vh)";
        next.style.transform = "translateY(0)";
        videoSticky = next.querySelector("#video-sticky");
        qty++;
      } else if (!scrollDown && qty > 1) {
        main = document.querySelector(`section.s${qty - 1}`);
        next = document.querySelector(`section.s${qty}`);
        main.style.transform = "translateY(0)";
        next.style.transform = "translateY(100vh)";
        videoSticky = main.querySelector("#video-sticky");
        qty--;
      }
    }
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
    // Wait for the scrolling to finish to reset the values
    if (videoSticky && !seenVideo) {
      videoSticky.onended = () => {
        seenVideo = true;
        unlockScroll();
      };
    } else {
      setTimeout(() => {
        unlockScroll();
      }, TIME_OUT);
    }
    lockScroll();
  }
  // Keep scrollbar in the middle of the viewport
  window.scroll(0, window.screen.height);
};
setTimeout(() => {
  window.onscroll = onWindowScroll;
}, 500);
