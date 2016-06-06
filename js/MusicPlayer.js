var audioCtx = new webkitAudioContext();
var audioDest = audioCtx.destination;
var analyser;

var fileChooser = document.getElementById('file-chooser');
fileChooser.onchange = function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    var bufferSourceNode = audioCtx.createBufferSource();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    bufferSourceNode.connect(analyser);
    analyser.connect(audioDest);

    audioCtx.decodeAudioData(e.target.result, function (buf) {
      bufferSourceNode.buffer = buf;
      bufferSourceNode.start(0);
    });
  }

  reader.readAsArrayBuffer(fileChooser.files[0]);

  var canvasEl = document.getElementById('stage');
  Waver.init(canvasEl, function () {
    if (analyser !== undefined) {
      var dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      var sum = 0;

      for (var i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      return (sum / dataArray.length) / 255;
    } else {
      return 0;
    }
  });
};
