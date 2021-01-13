let constraints = {
  video: {
    facingMode: "user",
    width: {
      ideal: 640,
    },
    height: {
      ideal: 400,
    }
  },
};

let videoStream;
let canvas = document.getElementById("canvas");
let video = document.getElementById("webcam");

init();

async function init() {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoStream.getVideoTracks().length > 1) {
      document.getElementById("label").innerText = videoStream.getVideoTracks().length;
      constraints.video.facingMode = "environment";
      document.getElementById("webcam").className = "webcam-rear";
    }
    let video = document.querySelector("#webcam");
    video.srcObject = videoStream;
  }
}

function flip() {
  videoStream.getTracks().forEach((track) => {
    track.stop();
  });
  if (constraints.video.facingMode == "user") {
    constraints.video.facingMode = "environment";
    document.getElementById("webcam").className = "webcam-rear";
  }
  else {
    constraints.video.facingMode = "user";
    document.getElementById("webcam").className = "webcam-front";
  }
  init();
}

function getvideomode() {
  console.log(constraints.video.facingMode);
}
