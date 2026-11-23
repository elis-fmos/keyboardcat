const display = document.getElementById("display");

const whiteKeys =
document.getElementById("whiteKeys");

const blackKeys =
document.getElementById("blackKeys");

let playMode = "fade";

/* ==========================
   AUDIO
========================== */

async function startAudio(){

    if(Tone.context.state !== "running"){
        await Tone.start();
    }

}

const synth = new Tone.Sampler({

    urls: {

        C4: "C4vL.wav",
        "D#4": "Ds4vL.wav",
        "F#4": "Fs4vL.wav",
        A4: "A4vL.wav",
        C5: "C5vL.wav"

    },

    release: 2,

    baseUrl: "samples/piano/"

}).toDestination();

Tone.Destination.volume.value = -8;

/* ==========================
   CONTROLS
========================== */

document
.getElementById("volume")
.addEventListener("input",e=>{

    Tone.Destination.volume.value =
    Number(e.target.value);

});

/* ==========================
   MODE BUTTONS
========================== */

document
.querySelectorAll(".modeButton")
.forEach(button=>{

    button.addEventListener(
    "click",

    ()=>{

        stopAll();

        document
        .querySelectorAll(".modeButton")
        .forEach(btn=>{

            btn.classList.remove(
                "active"
            );

        });

        button.classList.add(
            "active"
        );

        playMode =
        button.dataset.mode;

        display.textContent =
        `🎹 ${playMode.toUpperCase()} hamur`;

    });

});

/* ==========================
   HELPERS
========================== */

function stopAll(){

    try{
        synth.releaseAll();
    }catch(e){}

    clearHighlights();

    document
    .querySelectorAll(".active")
    .forEach(el=>{

        el.classList.remove(
            "active"
        );

    });

}

function clearHighlights(){

    document
    .querySelectorAll(
        ".chord-highlight"
    )
    .forEach(el=>{

        el.classList.remove(
            "chord-highlight"
        );

    });

}

function highlightNotes(notes){

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

function playNotes(notes){

    if(playMode==="sustain"){

        stopAll();

    }

    synth.triggerAttack(notes);

}

function releaseNotes(notes){

    if(playMode==="sustain"){
        return;
    }

    synth.triggerRelease(notes);

}

/* ==========================
   CHORDS
========================== */

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

function colourClass(root){

    return "key-" + root;

}

function addChordButtons(
containerId,
chords,
typeLabel
){

    const container =
    document.getElementById(
        containerId
    );

    chords.forEach(chord=>{

        const btn =
        document.createElement(
            "button"
        );

        btn.className =
        `chordButton ${colourClass(chord[0][0])}`;

        btn.textContent =
        chord[0];

        btn.addEventListener(
        "pointerdown",

        async ()=>{

            await startAudio();

            highlightNotes(
                chord[1]
            );

            display.textContent =
            `${chord[0]} = ${chord[1].join(" + ")} • ${typeLabel}`;

            playNotes(
                chord[1]
            );

        });

        btn.addEventListener(
        "pointerup",

        ()=>{

            releaseNotes(
                chord[1]
            );

        });

        btn.addEventListener(
        "pointerleave",

        ()=>{

            releaseNotes(
                chord[1]
            );

        });

        container.appendChild(
            btn
        );

    });

}

addChordButtons(
    "majorChords",
    chordData.major,
    "Dúrhljómur"
);

addChordButtons(
    "minorChords",
    chordData.minor,
    "Mollhljómur"
);

addChordButtons(
    "sevenChords",
    chordData.seven,
    "Sjöundarhljómur"
);

/* ==========================
   WHITE KEYS
========================== */

const whiteNoteList = [

"C4","D4","E4","F4",
"G4","A4","B4",

"C5","D5","E5","F5",
"G5","A5","B5"

];

whiteNoteList.forEach(note=>{

    const key =
    document.createElement("div");

    key.className =
    `white-key note-${note[0]}`;

    key.dataset.note = note;

    key.innerHTML =
    `<div>${note[0]}</div>`;

    key.addEventListener(
    "pointerdown",

    async ()=>{

        await startAudio();

        key.classList.add(
            "active"
        );

        display.textContent =
        note;

        playNotes([note]);

    });

    key.addEventListener(
    "pointerup",

    ()=>{

        key.classList.remove(
            "active"
        );

        releaseNotes([note]);

    });

    whiteKeys.appendChild(key);

});

/* ==========================
   BLACK KEYS
========================== */

const blackNoteList = [

{note:"C#4",left:48},
{note:"D#4",left:118},

{note:"F#4",left:258},
{note:"G#4",left:328},
{note:"A#4",left:398},

{note:"C#5",left:538},
{note:"D#5",left:608},

{note:"F#5",left:748},
{note:"G#5",left:818},
{note:"A#5",left:888}

];

blackNoteList.forEach(item=>{

    const key =
    document.createElement("div");

    key.className =
    `black-key note-${item.note[0]}`;

    key.dataset.note =
    item.note;

    key.style.left =
    `${item.left}px`;

    key.innerHTML =
    `<div>#</div>`;

    key.addEventListener(
    "pointerdown",

    async ()=>{

        await startAudio();

        key.classList.add(
            "active"
        );

        display.textContent =
        item.note;

        playNotes([item.note]);

    });

    key.addEventListener(
    "pointerup",

    ()=>{

        key.classList.remove(
            "active"
        );

        releaseNotes([item.note]);

    });

    blackKeys.appendChild(key);

});
