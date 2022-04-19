
// 2. This code loads the widget API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://youglish.com/public/emb/widget.js";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var widget;

// 8. common textbox
function extract_from_textbox() {
  var x = document.getElementById("myText").value;
  widget.fetch(x);
}

// 3. This function creates a widget after the API code downloads.
function onYouglishAPIReady(){
  widget = new YG.Widget("widget-1", {
    width: 640,
    components:2252, //search box & caption 
    autoStart: 0,
    events: {
      'onFetchDone': onFetchDone,
      'onVideoChange': onVideoChange,
      'onCaptionConsumed': onCaptionConsumed
    }          
  });
  // widget.fetch("test");
  // make sure the widget pops up at the very beginning
  // widget.fetch("test");
  // widget.pause();
  
}     
var views = 0, curTrack = 0, totalTracks = 0;
// 5. The API will call this method when the search is done
function onFetchDone(event){
  widget.pause();
  if (event.totalResult === 0)   alert("No result found");
  else totalTracks = event.totalResult; 
}
   
// 6. The API will call this method when switching to a new video. 
function onVideoChange(event){
  curTrack = event.trackNumber;
  views = 0;
}
   
// 7. The API will call this method when a caption is consumed. 
function onCaptionConsumed(event){
  if (++views < 3){
    widget.replay();
    widget.pause();
  }  
  else 
    if (curTrack < totalTracks)  
    widget.next();
}

// get recommendation function.
var word_list = 
[
  "Splash #K7agjXFFQJU","Green #K7agjXFFQJU","Irrigation #K7agjXFFQJU","previous #K7agjXFFQJU", "Vacation #HTgYHHKs0Zw",
  "Report #HTgYHHKs0Zw", "Submissions #HTgYHHKs0Zw","Shameless #sn81BfbZZDQ","Elbow #sn81BfbZZDQ",
  "Accidentally #sn81BfbZZDQ","wonderful #pTXhmv1pjcw","calibrate #CjVVNuraly8","obvious #CjVVNuraly8",
  "fired #CjVVNuraly8","ink #BKorP55Aqvg","impossible #BKorP55Aqvg","shines #uKSxRGggzkU",
  "wreck #uKSxRGggzkU", "circus #uKSxRGggzkU", "calm #pdQShdZaih8", "pep #pdQShdZaih8",
  "vexing #pdQShdZaih8", "answer #9FnO3igOkOk", "truth #9FnO3igOkOk", "question #9FnO3igOkOk",
  "serious #PoyejjJGajk","Fiend #PoyejjJGajk","relevant #tn48hUyFrKQ","barrel #7_uvEuNwUj4",
  "unicorn #NB1qppAPxk4",
  "spaceship #NB1qppAPxk4",	"professor #NB1qppAPxk4", "warrior #AhbCYVILusc",
  "tempt #AhbCYVILusc", 
  "noodles #ihKHvNOTcwk", "universe #ihKHvNOTcwk", "accident #ihKHvNOTcwk", "Muffin #mFl8nzZuExE",
  "marry #mFl8nzZuExE", "beauty #iropsnsCEjA",  "freshness #iropsnsCEjA",  "feminine #iropsnsCEjA",
  "confused #tmWKvvXzlyg", "correction #tmWKvvXzlyg", "stop #tmWKvvXzlyg", "convince #qCVOgE1m5fY",
  "associate #nLGBEETtEPc",	"accident #qCVOgE1m5fY", "revenge #qCVOgE1m5fY","luck #NB1qppAPxk4",
  "fluffy #NB1qppAPxk4", "again #NB1qppAPxk4", 
  "believe #ifwM5XH9ghk", "panic #ifwM5XH9ghk", "safety #ifwM5XH9ghk", 
  "traditions #nLGBEETtEPc","nose  #nLGBEETtEPc"
]

var index = 0;   
function get_random(){
  index = Math.floor(Math.random() * word_list.length);
  return index;
}

// fetching recommended word to common textbox
function recommendataion(){
  index = get_random();
  let old_word = word_list[index];
  let new_word = word_list[index].split("#")[0].trim();
  console.log(old_word, new_word);
  widget.fetch(old_word);
  document.getElementById("myText").value = new_word;
}

