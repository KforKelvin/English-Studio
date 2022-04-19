//create variable in config.js that holds your API key
var api_key = config.DICTIONARY_API_KEY;

//asynchronous function that returns word's shortened definition and ipa spelling
//into HTML elements with id = 'def' and 'pron' respectively
async function getWordData() {

    var support = true;
    //gather user-inputted word from main.hbs
    var text = document.getElementById('myText').value;
    console.log("Entered value: " + text);

    //url used to request data from dictionary api. constructed using user input
    const api_url = 'https://dictionaryapi.com/api/v3/references/learners/json/' + text + '?key=' + api_key;

    //request information from dictionary api
    const response = await fetch(api_url);
    const data = await response.json();

    //get word definition and display on frontend
    try {
        var definition;
        try {
            definition = data[0].meta['app-shortdef']['def'][0];
        }
        catch (err) {
            console.log(err.message);
        }

        //if definition still null, check a different location
        if (definition == null) {
            definition = data[0].shortdef[0];
        }
        
        
        //removing formatting characters
        definition = definition.replace("{bc}", "");
        definition = definition.replace("{b}", "");
        definition = definition.replace("{/b}", "");
        var searchTargetStart = "{it}";
        var searchTargetEnd = "{/it}";
        var startIndex = definition.indexOf(searchTargetStart);
        var endIndex = definition.indexOf(searchTargetEnd);
        if (startIndex != -1 && endIndex != -1) {
            definition = definition.substring(0, startIndex) + definition.substring(endIndex + 5, definition.length);
        }

        //cutoff second definition if given
        var searchTargetStartThree = "{bc}";
        var startIndexThree = definition.indexOf(searchTargetStartThree);
        if (startIndexThree != -1) {
            definition = definition.substring(0,startIndexThree);
        }

        //display definition
        var definitionStr = "Definition: ";
        definitionStr = definitionStr.bold();
        definitionStr = definitionStr + definition;
        definitionStr = definitionStr + "<br>";
        document.getElementById('def').innerHTML = definitionStr;

    }
    catch (err) {
        console.log(err.message);
        document.getElementById('def').innerHTML = "This word is not supported by the learner's dictionary.";
        document.getElementById('sent').innerHTML = "";
        document.getElementById('syll').innerHTML = "";
        document.getElementById('audioTag').src = "";
        support = false;
    }
    
    //get example usage of word
    if (support) {
        try {
            var sentence;

            //iterate through dt until we find "vis"
            try {
                var iterator = data[0].def[0].sseq[0][0][1].dt.length;
                for (var i = 0; i < iterator; i++) {
                    if (data[0].def[0].sseq[0][0][1].dt[i][0] == "vis") {
                        sentence = JSON.stringify(data[0].def[0].sseq[0][0][1].dt[i][1][0]);
                    }
                    else if (data[0].def[0].sseq[0][0][1].dt[i][0] == "uns") {
                        if (data[0].def[0].sseq[0][0][1].dt[i][1][0][1][0] == "vis") {
                            sentence = JSON.stringify(data[0].def[0].sseq[0][0][1].dt[i][1][0][1][1][0]);
                        }
                    }
                }
            }
            catch (err) {
                console.log(err.message);
            }
            

            //if example usage is still not found. check another location and iterate through
            if (sentence == null) {
                var iteratorTwo = data[0].def[0].sseq[0].length;
                for (var p = 1; p < iteratorTwo; p++) {
                    var iteratorThree = data[0].def[0].sseq[0][p][1].dt.length;
                    for (var q = 0; q < iteratorThree; q++) {
                        if (data[0].def[0].sseq[0][p][1].dt[q][0] == "vis") {
                            sentence = JSON.stringify(data[0].def[0].sseq[0][p][1].dt[q][1][0]);
                        }
                    }
                }
            }

            //removing formatting and extra characters
            sentence = sentence.replace("{\"t\":", "");
            sentence = sentence.replace("{it}", "");
            sentence = sentence.replace("{/it}", "");
            sentence = sentence.replace("{it}", "");
            sentence = sentence.replace("{/it}", "");
            sentence = sentence.replace("{it}", "");
            sentence = sentence.replace("{/it}", "");
            sentence = sentence.replace("{b}", "");
            sentence = sentence.replace("{/b}", "");
            sentence = sentence.replace("{inf}", "");
            sentence = sentence.replace("{/inf}", "");
            sentence = sentence.replace("{ldquo}", "\"");
            sentence = sentence.replace("{rdquo}", "\"");
            sentence = sentence.replace("{sc}", "");
            sentence = sentence.replace("{/sc}", "");
            sentence = sentence.replace("{sup}", "");
            sentence = sentence.replace("{/sup}", "");
            sentence = sentence.replace("{phrase}", "");
            sentence = sentence.replace("{/phrase}", "");
            sentence = sentence.slice(0,-1);
        
            //finding all indices that target word occurs in example usage
            var beginIndex = 1;
            var indices = [];
            var entry = data[0].meta.stems[0];
            entry = entry.toUpperCase();
            var wordLength = entry.length;
            //console.log("This is the search word" + text);
            //console.log("This is sentence searching within: " + sentence);
            while (beginIndex != 0) {
                beginIndex = sentence.toUpperCase().indexOf(entry, beginIndex);
                if (beginIndex != -1) {
                    indices.push(beginIndex);
                }
                beginIndex++;
            }
            //making the word appear bold in each occurence
            var adjust = 0;
            for (var curIndex = 0; curIndex < indices.length; curIndex++) {
                var word = sentence.slice(indices[curIndex] + adjust, indices[curIndex] + adjust + wordLength);
                word = word.bold();
                sentence = sentence.split('');
                sentence.splice(indices[curIndex] + adjust, wordLength, word);
                sentence = sentence.join('');
                adjust = adjust + 7;
            }
    
            //removing words within brackets due to incompatible formatting in JSON 
            var searchTargetStartTwo = "[";
            var searchTargetEndTwo = "]";
            var startIndexTwo = sentence.indexOf(searchTargetStartTwo);
            var endIndexTwo = sentence.indexOf(searchTargetEndTwo);
            if (startIndexTwo != -1 && endIndexTwo != -1) {
                sentence = sentence.substring(0, startIndexTwo) + sentence.substring(endIndexTwo + 1, sentence.length);
            }
    
            //displaying example usage on frontend
            var sentenceStr = "Example Usage: ";
            sentenceStr = sentenceStr.bold();
            sentenceStr = sentenceStr + sentence;
            sentenceStr = sentenceStr + "<br>";
            document.getElementById('sent').innerHTML = sentenceStr;
        }
        catch (err) {
            console.log(err.message);
            document.getElementById('sent').innerHTML = "";
        }
    }

    //get syllables
    if (support) {
        try {
            const syllables = data[0].hwi.hw;
            var syllablesStr = "Syllables: ";
            syllablesStr = syllablesStr.bold();
            syllablesStr = syllablesStr + syllables;
            syllablesStr = syllablesStr + "<br>";
            document.getElementById('syll').innerHTML = syllablesStr;
        }
        catch (err) {
            console.log(err.message);
            document.getElementById('syll').innerHTML = "";
        }
    }

    //get audio clip
    var audioURL = "https://media.merriam-webster.com/audio/prons/en/us/mp3/";
    try {
        //not all words contain audio
        var audioFile = data[0].hwi.prs[0].sound.audio;
        //updating path to audio file
        if (audioFile.substring(0,3) == "bix") {
            audioURL += "bix/";
        }
        else if (audioFile.substring(0,2) == "gg") {
            audioURL += "gg/";
        }
        //checking if first character is a letter
        else if ((audioFile.charCodeAt(0) > 64 && audioFile.charCodeAt(0) < 91) || (audioFile.charCodeAt(0) > 96 && audioFile.charCodeAt(0) < 123)) {
            audioURL += audioFile.substring(0,1) + "/";
        }
        else {
            audioURL += "number/";
        }
        audioURL += audioFile + ".mp3";

        //updating source of audio on frontend
        document.getElementById('audioTag').src = audioURL;
    }
    catch(err) {
        console.log(err.message);
        document.getElementById('audioTag').src = "";
    }
}
getWordData().catch(console.error);
