const keyboard =
document.getElementById("keyboard");

const display =
document.getElementById("display");

let synth;
let holdMode = false;

let currentNote = null;
let currentChord = [];

const notes = [

"C3","C#3","D3","D#3","E3",
"F3","F#3","G3","G#3","A3","A#3","B3",

"C4","C#4","D4","D#4","E4",
"F4","F#4","G4","G#4","A4","A#4","B4",

"C5","C#5","D5","D#5","E5",
"F5","F#5","G5","G#5","A5","A#5","B5"

];

const chordGroups = {

major:[
["C","C4,E4,G4"],
["D","D4,F#4,A4"],
["E","E4,G#4,B4"],
["F","F4,A4,C5"],
["G","G4,B4,D5"],
["A","A4,C#5,E5"],
["B","B4,D#5,F#5"]
],

minor:[
["Cm","C4,D#4,G4"],
["Dm","D4,F4,A4"],
["Em","E4,G4,B4"],
["Fm","F4,G#4,C5"],
["Gm","G4,A#4,D5"],
["Am","A4,C5,E5"],
["Bm","B4,D5,F#5"]
],

seven:[
["C7","C4,E4,G4,A#4"],
["D7","D4,F#4,A4,C5"],
["E7","E4,G#4,B4,D5"],
["F7","F4,A4,C5,D#5"],
["G7","G4,B4,D5,F5"],
["A7","A4,C#5,E5,G5"],
["B7","B4,D#5,F#5,A5"]
]

};

function colour(root){

return{
C:'key-C',
D:'key-D',
E:'key-E',
F:'key-F',
G:'key-G',
A:'key-A',
B:'key-B'
}[root];
}

function createInstrument(){

if(synth){
synth.dispose();
}

synth =
new Tone.PolySynth(
Tone.Synth
).toDestination();

}

createInstrument();

async function startAudio(){

if(Tone.context.state !== "running"){
await Tone.start();
}

}

function clearHighlights(){

document
.querySelectorAll(".chord-highlight")
.forEach(key =>
key.classList.remove(
"chord-highlight"
));

}

function highlightChord(notes){

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

function stopEverything(){

if(currentNote){
synth.triggerRelease(
currentNote
);
}

if(currentChord.length){
synth.triggerRelease(
currentChord
);
}

currentNote = null;
currentChord = [];
}

function createChordButton(
name,
notes,
container
){

const btn =
document.createElement("button");

btn.className =
"chord " +
colour(name[0]);

btn.textContent =
name;

container
.appendChild(btn);

btn.addEventListener(
"pointerdown",
async ()=>{

await startAudio();

if(holdMode){
stopEverything();
}

const chordNotes =
notes.split(",");

currentChord =
chordNotes;

highlightChord(
chordNotes
);

display.textContent =
`${name} (${chordNotes.join(" + ")})`;

synth.triggerAttack(
chordNotes
);

}
);

btn.addEventListener(
"pointerup",
()=>{

if(!holdMode){

synth.triggerRelease(
notes.split(",")
);

clearHighlights();

}

});

}

Object.entries(chordGroups)
.forEach(group=>{

const container =
document.getElementById(
group[0] + "Chords"
);

group[1].forEach(chord=>{

createChordButton(
chord[0],
chord[1],
container
);

});

});

let whiteIndex = 0;

notes.forEach(note=>{

const black =
note.includes("#");

const key =
document.createElement("div");

key.dataset.note =
note;

if(black){

key.className =
"black-key";

key.style.left =
`${whiteIndex*65-20}px`;

}else{

key.className =
"white-key";

whiteIndex++;

}

key.classList.add(
`note-${note[0]}`
);

key.innerHTML =
`<div>${note.replace(/[0-9]/g,"")}</div>`;

keyboard.appendChild(key);

key.addEventListener(
"pointerdown",
async ()=>{

await startAudio();

if(holdMode){
stopEverything();
}

currentNote = note;

display.textContent =
note;

key.classList.add(
"active"
);

synth.triggerAttack(
note
);

});

key.addEventListener(
"pointerup",
()=>{

if(!holdMode){

key.classList.remove(
"active"
);

synth.triggerRelease(
note
);

}

});

});

document
.getElementById("menuBtn")
.addEventListener(
"click",
()=>{

document
.getElementById("sidebar")
.classList.toggle(
"closed"
);

});

document
.getElementById("sustainBtn")
.addEventListener(
"click",
()=>{

holdMode = !holdMode;

document
.getElementById("sustainBtn")
.textContent =
holdMode
? "Hold ON"
: "Hold OFF";

});

document
.getElementById("volume")
.addEventListener(
"input",
e=>{

Tone.Destination
.volume.value =
e.target.value;

});

Tone.Destination
.volume.value = -8;
