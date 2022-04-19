// Opening Google Cloud Speech API and Filesystem module
const gspeech = require('@google-cloud/speech');
const fs = require('fs');

var speechToText = async function speechToText() {

    // instantiate speech client
    const client = new gspeech.SpeechClient();

    const filename = __dirname + '/uploads/upload.wav';

    if (!fs.existsSync(filename)) {
        return;
    }

    // reading audio file and converting it to base64
    const file = fs.readFileSync(filename);
    const audioBytes = file.toString('base64');

    const audio = {
        content: audioBytes  
    };

    // TODO - Add a way to choose between American/British english
    const config = {
        encoding: 'LINEAR16',
        // sampleRateHertz: 44100,
        languageCode: 'en-US'
    };

    const request = {
        audio: audio,
        config: config
    }

    /*  returns promise that resolves to contain a result

        each result has a property called "Alternatives"
        Alternatives has three properties:
        transcript, confidence, and words


        The ones necessary for this project are transcript and confidence:

        transcript is the string of recognized words
        confidence is how likely the transcript is correct
    */
    const [response] = await client.recognize(request);

    // writing transcription and confidence to json
    const transcription = response.results.map(result => result.alternatives[0].transcript);
    const confidence = response.results.map(result => result.alternatives[0].confidence);

    let user_audio = { 
        transcription: transcription,
        confidence: confidence
    };
    
    let data = JSON.stringify(user_audio, null, 2);
    // let data = transcription + "--" + confidence;
    console.log("speech.js output:");
    console.log(data);
    // return data;
    return user_audio;
}

module.exports = speechToText;
