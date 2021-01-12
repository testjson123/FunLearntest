////////////////
const IMG_SIZE = 80;
const INTERVAL = 500;

//--Webcam
const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const snapSoundElement = document.getElementById("snapSound");
const flip = document.getElementById("btn-flip");

let webcam = new Webcam(webcamElement, "user", canvasElement, snapSoundElement);

async function _init_() {
  //--Load model
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/testjson123/tfjs/master/saved%20models/animals/model.json"
  );
  console.log("model loaded");

  //console.log(flip);

  webcam
    .start()
    .then((result) => {
      console.log("webcam started");
    })
    .catch((err) => {
      console.log(err);
    });
  //----------------------------------------

  //--Webcam loop and predict
  webcamElement.addEventListener("play", () => {
    setInterval(async () => {
      const res = predict(model, webcamElement);
      document.getElementById("label").innerText = `${res[2] * 100}% ${res[1]}`;
    }, INTERVAL);
  });
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

_init_();

/**
 * Get highest probability
 * return max index, class name and probability value
 */
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

/* Get all video input devices info */
function getVideoInputs() {
  // let webcamList = [];
  // mediaDevices.forEach((mediaDevice) => {
  //   if (mediaDevice.kind === "videoinput") {
  //     webcamList.push(mediaDevice);
  //   }
  // });
  // if (webcamList.length == 1) {
  //   facingMode = "user";
  // }
  // return webcamList;
  webcam.facingMode = webcam.facingMode == "user" ? "enviroment" : "user";
  webcamElement.style.transform = "";
}
