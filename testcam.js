init();
async function init() {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    // ok, browser supports it
    //const videoStream = await navigator.mediaDevices.getUserMedia({
    // video: true,
    //});
    const constraints = {
      video: {
        width: {
          min: 400,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 640,
          ideal: 1080,
          max: 1440,
        },
        facingMode: "environment",
      },
    };

    const videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.querySelector("#video");
    //videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = videoStream;
    videoStream.getTracks().forEach((track) => {
      //track.stop();
    });
  }
}
