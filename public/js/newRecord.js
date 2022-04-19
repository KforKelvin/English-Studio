async function setPractice() {
    document.getElementById('practice').innerHTML = document.getElementById('myText').value;
}

var gumStream; // to hold audio stream
var rec; // for Recorder.js
var mic; // for microphone input
var audioContext; // for audio context api

// getting HTML elements
var startRecord = document.getElementById("startRecord");
var stopRecord = document.getElementById("stopRecord");
var pause = document.getElementById("pause");
var updateScore = document.getElementById("updateScore");

// Event listeners for buttons
startRecord.addEventListener("click", startRecording);
stopRecord.addEventListener("click", stopRecording);
pause.addEventListener("click", pauseRecording);
updateScore.addEventListener("click", updatingScore);

function startRecording() {
    // enabling stop and pause
    startRecord.disabled = true;
    stopRecord.disabled = false;
    pause.disabled = false

    // getting microphone input
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        audioContext = new AudioContext();

        gumStream = stream;

        mic = audioContext.createMediaStreamSource(stream);

        // create new recorder and start recording
        rec = new Recorder(mic, { numChannels: 1 })
        rec.record()
        console.log("Recording started");

    }).catch(function (err) {
        startRecord.disabled = false;
        stopRecord.disabled = true;
        pause.disabled = true
    });
}

function pauseRecording() {
    console.log("pause clicked rec.recording=", rec.recording);
    if (rec.recording) {
        rec.stop();
        pause.innerHTML = "Resume";
    } else {
        rec.record()
        pause.innerHTML = "Pause";

    }
}

function stopRecording() {
    console.log("stopRecord clicked");

    // enable recording
    stopRecord.disabled = true;
    startRecord.disabled = false;
    pause.disabled = true;

    pause.innerHTML = "Pause"; // reset
    rec.stop(); // stop recording
    gumStream.getAudioTracks()[0].stop(); // disable microphone access

    // export wav encoded blob to displayAndUpload
    rec.exportWAV(displayAndUpload);
}

// display recorded audio for playback and upload file to server
function displayAndUpload(blob) {
    // displaying on page
    var url = URL.createObjectURL(blob);
    playback.src = URL.createObjectURL(blob);
    playback.controls = true;

    // uploading to server
    var fd = new FormData();
    fd.append('upl', blob, 'upload.wav');
    fetch('/api/test', { method: 'post', body: fd });

    // enable scoring button
    updateScore.disabled = false;
}

// request score and transcription from server
function updatingScore() {
    console.log("Updating score")
    $.ajax({
        method: 'GET',
        url: '/api/transcribe/',
        success: function (response) {
            // score
            var score = document.getElementById('score');

            console.log("Transcribed data:")
            console.log(response);

            if (response.confidence.length == 0)
                score.innerHTML = "Please try recording again";
            else {
                var accuracy = Math.round(response.confidence * 100);
                score.innerHTML = accuracy;

                // handle text
                myText.value = response.transcription;
                getWordData();
                extract_from_textbox();
            }
        }
    })
    updateScore.disabled = true; // disable scoring again
}