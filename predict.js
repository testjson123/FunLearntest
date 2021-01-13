//--Decide which camera to start depends on screen size (rear for mobile, front for pc)
let facing = "";
let classFacing = "";
if (window.screen.height / window.screen.width > 1.4) {
  facing = "environment";
  classFacing = "webcam-rear";
}
else {
  facing = "user";
  classFacing = "webcam-front";
}

let constraints = {
  video: {
    facingMode: facing,
    width: {
      ideal: 640,
    },
    height: {
      ideal: 400,
    }
  },
};

//-----------------------------------------
const IMG_SIZE = 80;
const INTERVAL = 500;


let videoStream;
let canvas = document.getElementById("canvas");
let video = document.getElementById("webcam");
const snapSoundElement = document.getElementById("snapSound");
let videoStarted = false;
const btnScreenshot = document.querySelector("#btnScreenshot")
const screenshotsContainer = document.querySelector("#screenshots");

start_cam();
setTimeout(function () { _init_(); }, 800);


async function _init_() {
  //--Load model
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/testjson123/FunLearntest/main/model/savedModels/tfjs/animals/model.json"
  );
  console.log("model loaded");
  //----------------------------------------

  //--Webcam loop and predict
  if (!videoStarted) {
    video.addEventListener("play", callToPredict(model));
  }
}


async function start_cam() {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    let video = document.querySelector("#webcam");
    document.getElementById("webcam").className = classFacing;
    video.srcObject = videoStream;
  }
}


function flip() {
  videoStream.getTracks().forEach((track) => {
    track.stop();
  });
  if (constraints.video.facingMode == "user") {
    constraints.video.facingMode = "environment";
    classFacing = "webcam-rear";
  }
  else {
    constraints.video.facingMode = "user";
    classFacing = "webcam-front";
  }
  start_cam();

}



function callToPredict(model) {
  setInterval(async () => {
    const res = predict(model, video);
    document.getElementById("label").innerText = `${res[2] * 100}% ${res[1]}`;
  }, INTERVAL);
}


function predict(model, image) {
  const tensor = tf.browser
    .fromPixels(image)
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  const imageResize = tf.image.resizeBilinear(tensor, [IMG_SIZE, IMG_SIZE]);
  const prediction = model.predict(imageResize);

  let result = prediction.dataSync();
  console.log(result);
  return showResult(result);
}


function showResult(arr) {
  if (arr.length === 0) {
    return -1;
  }
  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return [maxIndex, CLASS_NAMES[maxIndex], max.toFixed(2)];
}




// btnScreenshot.addEventListener("click", function () {
//   const img = document.createElement("img");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   canvas.getContext("2d").drawImage(video, 0, 0);
//   img.src = canvas.toDataURL("image/png");
//   screenshotsContainer.prepend(img);
// });




//---------------------------------------------------------------------------------
//(not needed)
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
// }