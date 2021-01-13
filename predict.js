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


const IMG_SIZE = 80;
const INTERVAL = 500;
////////////////--------------------------------------

let videoStream;
let canvas = document.getElementById("canvas");
let video = document.getElementById("webcam");
const snapSoundElement = document.getElementById("snapSound");

init();


async function init() {
  //--Load model
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/testjson123/FunLearntest/main/model/savedModels/tfjs/animals/model.json"
  );
  console.log("model loaded");
  //----------------------------------------

  //--Initialize Webcam
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    let video = document.querySelector("#webcam");
    video.srcObject = videoStream;
  }

  //--Webcam loop and predict
  video.addEventListener("play", () => {
    setInterval(async () => {
      const res = predict(model, video);
      document.getElementById("label").innerText = `${res[2] * 100}% ${res[1]}`;
    }, INTERVAL);
  });
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