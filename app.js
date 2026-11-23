const display = document.getElementById("display");
const sidebar = document.getElementById("sidebar");

const whiteKeysContainer =
document.getElementById("whiteKeys");

const blackKeysContainer =
document.getElementById("blackKeys");

let playMode = "fade";

async function startAudio() {

    if (Tone.context.state !== "running") {
        await Tone.start();
    }

}

const synth = new Tone.PolySynth(
    Tone.Synth,
    {
        envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.25,
            release: 3
        }
    }
).toDestination();

Tone.Destination.volume.value = -8;

document
.getElementById("volume")
.addEventListener("input", e => {

    Tone.Destination.volume.value =
    Number(e.target.value);

});

document
.getElementById("playMode")
.addEventListener("change", e => {

    stopAll();

    playMode = e.target.value;

    display.textContent =
    `🎹 Hamur: ${playMode}`;

});

document
.getElementById("toggleSidebar")
.addEventListener("click", () => {

    sidebar.classList.toggle("hidden");

});

function stopAll() {

    try {
        synth.releaseAll();
    }
    catch (e) {}

    clearHighlights();

}

function clearHighlights() {

    document
    .querySelectorAll(".chord-highlight")
    .forEach(key => {

        key.classList.remove(
            "chord-highlight"
        );

    });

}

function highlightNotes(notes) {

    clearHighlights();

    notes.forEach(note => {

        const key =
        document.querySelector(
        `[data-note="${note}"]`
        );

        if (key) {

            key.classList.add(
                "chord-highlight"
            );

        }

    });

}

function playNotes(notes) {

    if (playMode === "sustain") {
        stopAll();
    }

    synth.triggerAttack(notes);

}

function releaseNotes(notes) {

    if (playMode === "sustain") {
        return;
    }

    synth.triggerRelease(notes);

}

const chordData = {

major: [

["C", ["C4","E4","G4"]],
["D", ["D4","F#4","A4"]],
["E", ["E4","G#4","B4"]],
["F", ["F4","A4","C5"]],
["G", ["G4","B4","D5"]],
["A", ["A4","C#5","E5"]],
["B", ["B4","D#5","F#5"]]

],

minor: [

["Cm", ["C4","D#4","G4"]],
["Dm", ["D4","F4","A4"]],
["Em", ["E4","G4","B4"]],
["Fm", ["F4","G#4","C5"]],
["Gm", ["G4","A#4","D5"]],
["Am", ["A4","C5","E5"]],
["Bm", ["B4","D5","F#5"]]

],

seven: [

["C7", ["C4","E4","G4","A#4"]],
["D7", ["D4","F#4","A4","C5"]],
["E7", ["E4","G#4","B4","D5"]],
["F7", ["F4","A4","C5","D#5"]],
["G7", ["G4","B4","D5","F5"]],
["A7", ["A4","C#5","E5","G5"]],
["B7", ["B4","D#5","F#5","A5"]]

]

};

function buildChordButtons() {

    createChordGroup(
        "majorChords",
        chordData.major,
        "major",
        "Dúrhljómur"
    );

    createChordGroup(
        "minorChords",
        chordData.minor,
        "minor",
        "Mollhljómur"
    );

    createChordGroup(
        "sevenChords",
        chordData.seven,
        "seven",
        "Sjöundarhljómur"
    );

}

function createChordGroup(
containerId,
chords,
cssClass,
typeName
){

    const container =
    document.getElementById(
        containerId
    );

    chords.forEach(chord => {

        const button =
        document.createElement(
            "button"
        );

        button.className =
        `chordButton ${cssClass}`;

        button.textContent =
        chord[0];

        button.addEventListener(
        "pointerdown",

        async () => {

            await startAudio();

            highlightNotes(
                chord[1]
            );

            display.textContent =
            `${chord[0]} = ${chord[1].join(" + ")} • ${typeName}`;

            playNotes(
                chord[1]
            );

        });

        button.addEventListener(
        "pointerup",

        () => {

            releaseNotes(
                chord[1]
            );

        });

        container.appendChild(
            button
        );

    });

}

buildChordButtons();

/* ===== Hvítir takkar ===== */

const whiteNotes = [

"C4","D4","E4","F4",
"G4","A4","B4",

"C5","D5","E5","F5",
"G5","A5","B5"

];

whiteNotes.forEach(note => {

    const key =
    document.createElement("div");

    key.className =
    `white-key note-${note[0]}`;

    key.dataset.note = note;

    key.innerHTML =
    `<div>${note[0]}</div>`;

    key.addEventListener(
    "pointerdown",

    async () => {

        await startAudio();

        if(playMode==="sustain"){
            stopAll();
        }

        key.classList.add(
            "active"
        );

        display.textContent =
        note;

        playNotes([note]);

    });

    key.addEventListener(
    "pointerup",

    () => {

        key.classList.remove(
            "active"
        );

        releaseNotes([note]);

    });

    whiteKeysContainer
    .appendChild(key);

});

/* ===== Svartir takkar ===== */

const blackNotes = [

{note:"C#4", pos:48},
{note:"D#4", pos:122},

{note:"F#4", pos:270},
{note:"G#4", pos:344},
{note:"A#4", pos:418},

{note:"C#5", pos:566},
{note:"D#5", pos:640},

{note:"F#5", pos:788},
{note:"G#5", pos:862},
{note:"A#5", pos:936}

];

blackNotes.forEach(item => {

    const key =
    document.createElement("div");

    key.className =
    `black-key note-${item.note[0]}`;

    key.dataset.note =
    item.note;

    key.style.left =
    `${item.pos}px`;

    key.innerHTML =
    `<div>#</div>`;

    key.addEventListener(
    "pointerdown",

    async () => {

        await startAudio();

        if(playMode==="sustain"){
            stopAll();
        }

        key.classList.add(
            "active"
        );

        display.textContent =
        item.note;

        playNotes(
            [item.note]
        );

    });

    key.addEventListener(
    "pointerup",

    () => {

        key.classList.remove(
            "active"
        );

        releaseNotes(
            [item.note]
        );

    });

    blackKeysContainer
    .appendChild(key);

});
