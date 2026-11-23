const display = document.getElementById("display");
const keyboard = document.getElementById("keyboard");

let playMode = "fade";

const synth = new Tone.PolySynth(
Tone.Synth,
{
envelope:{
attack:0.01,
decay:0.2,
sustain:0.25,
release:3
}
}
).toDestination();

Tone.Destination.volume.value = -8;

document.getElementById("volume")
.addEventListener("input",e=>{
Tone.Destination.volume.value=e.target.value;
});

document.getElementById("playMode")
.addEventListener("change",e=>{

    stopAll();

    playMode=e.target.value;

});

document.getElementById("toggleSidebar")
.addEventListener("click",()=>{
document
.getElementById("sidebar")
.classList.toggle("hidden");
});

async function startAudio(){

if(Tone.context.state!=="running"){
await Tone.start();
}

}

const chordData = {

major:[
["C",["C4","E4","G4"]],
["D",["D4","F#4","A4"]],
["E",["E4","G#4","B4"]],
["F",["F4","A4","C5"]],
["G",["G4","B4","D5"]],
["A",["A4","C#5","E5"]],
["B",["B4","D#5","F#5"]]
],

minor:[
["Cm",["C4","D#4","G4"]],
["Dm",["D4","F4","A4"]],
["Em",["E4","G4","B4"]],
["Fm",["F4","G#4","C5"]],
["Gm",["G4","A#4","D5"]],
["Am",["A4","C5","E5"]],
["Bm",["B4","D5","F#5"]]
],

seven:[
["C7",["C4","E4","G4","A#4"]],
["D7",["D4","F#4","A4","C5"]],
["E7",["E4","G#4","B4","D5"]],
["F7",["F4","A4","C5","D#5"]],
["G7",["G4","B4","D5","F5"]],
["A7",["A4","C#5","E5","G5"]],
["B7",["B4","D#5","F#5","A5"]]
]

};

function clearHighlights(){

document
.querySelectorAll(".chord-highlight")
.forEach(key=>{
key.classList.remove("chord-highlight");
});

}

function stopAll(){

try{
synth.releaseAll();
}catch(e){}

clearHighlights();

}

function showChord(name,notes){

display.textContent =
`${name} = ${notes.join(" + ")}`;

clearHighlights();

notes.forEach(note=>{

const key =
document.querySelector(
`[data-note="${note}"]`
);

if(key){
key.classList.add(
"chord-highlight"
);
}

});

}

function createChordButtons(){

Object.keys(chordData)
.forEach(group=>{

const container =
document.getElementById(
group + "Chords"
);

chordData[group]
.forEach(chord=>{

const btn =
document.createElement("button");

btn.className="chord";

btn.textContent=chord[0];

btn.addEventListener(
"pointerdown",
async ()=>{

await startAudio();

if(playMode==="sustain"){
stopAll();
}

showChord(
chord[0],
chord[1]
);

synth.triggerAttack(
chord[1]
);

}
);

btn.addEventListener(
"pointerup",
()=>{

if(playMode!=="sustain"){

synth.triggerRelease(
chord[1]
);

}

}
);

container.appendChild(btn);

});

});

}

createChordButtons();

const notes=[
"C3","D3","E3","F3","G3","A3","B3",
"C4","D4","E4","F4","G4","A4","B4",
"C5","D5","E5","F5","G5","A5","B5"
];

notes.forEach(note=>{

const key =
document.createElement("div");

key.className =
`white-key note-${note[0]}`;

key.dataset.note = note;

key.textContent = note;

key.addEventListener(
"pointerdown",
async ()=>{

await startAudio();

if(playMode==="sustain"){
stopAll();
}

display.textContent = note;

key.classList.add("active");

synth.triggerAttack(note);

}
);

key.addEventListener(
"pointerup",
()=>{

key.classList.remove("active");

if(playMode!=="sustain"){

synth.triggerRelease(note);

}

}
);

keyboard.appendChild(key);

});
