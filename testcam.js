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
init();

async function init() {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    let video = document.querySelector("#webcam");
    //videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = videoStream;
  }
}

function getVideoInputs() {
  videoStream.getTracks().forEach((track) => {
    track.stop();
  });
  constraints.video.facingMode == "user"
    ? (constraints.video.facingMode = "environment")
    : constraints.video.facingMode = "user";
  init();
}

function getvideomode() {
  console.log(constraints.video.facingMode);
}
