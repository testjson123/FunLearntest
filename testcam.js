let constraints = {
  video: {
    facingMode: "environment",
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
  //--Initialize Webcam
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
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







/**
 * check num of video devices
 * */
// function input_devices() {
//   navigator.mediaDevices.enumerateDevices()
//     .then(function (devices) {
//       //console.log(devices)
//       const videoDevices = devices.filter(device => device.kind === 'videoinput')
//       document.getElementById("label").innerText = videoDevices.length;
//     })
// }  // (not needed)