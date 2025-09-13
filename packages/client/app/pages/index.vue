<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { onKeyStroke } from "@vueuse/core";
import isMobile from "is-mobile";
import SingleNote from "@/components/notation/SingleNote.vue";

const currentNote = ref("c/4");
const previousNote = ref("");
const currentClef = ref<"treble" | "bass">("treble");
const clefSetting = ref<"treble" | "bass">("treble");
const feedback = ref<"waiting" | "correct" | "incorrect">("waiting");
const deviceIsMobile = ref(false);

const noteNames = ["c", "d", "e", "f", "g", "a", "b"];

function generateNoteRange(startNote: string, endNote: string): string[] {
  const notes: string[] = [];

  const startParts = startNote.split("/");
  const endParts = endNote.split("/");

  if (startParts.length < 2 || endParts.length < 2) {
    console.error("Invalid note format provided to generateNoteRange");
    return [];
  }

  const currentNoteName = startParts[0];
  const currentOctaveStr = startParts[1];
  const endNoteName = endParts[0];
  const endOctaveStr = endParts[1];

  if (!currentNoteName || !currentOctaveStr || !endNoteName || !endOctaveStr) {
    console.error("Invalid note format: missing note name or octave");
    return [];
  }

  let currentOctave = Number(currentOctaveStr);
  const endOctave = Number(endOctaveStr);
  let currentIndex = noteNames.indexOf(currentNoteName);

  if (currentIndex === -1) {
    console.error(`Invalid note name: ${currentNoteName}`);
    return [];
  }

  while (
    currentOctave < endOctave ||
    (currentOctave === endOctave &&
      noteNames.indexOf(endNoteName) >= currentIndex)
  ) {
    notes.push(`${noteNames[currentIndex]}/${currentOctave}`);
    currentIndex++;
    if (currentIndex >= noteNames.length) {
      currentIndex = 0;
      currentOctave++;
    }
  }
  return notes;
}

const trebleNotes = generateNoteRange("f/3", "e/6");
const bassNotes = generateNoteRange("c/2", "e/4");

const generateNewNote = () => {
  feedback.value = "waiting";

  const finalClef = clefSetting.value;
  currentClef.value = finalClef;

  const notePool = finalClef === "treble" ? trebleNotes : bassNotes;

  const availableNotes = notePool.filter((note) => note !== currentNote.value);

  const notesToChooseFrom =
    availableNotes.length > 0 ? availableNotes : notePool;

  const randomIndex = Math.floor(Math.random() * notesToChooseFrom.length);
  const selectedNote = notesToChooseFrom[randomIndex];

  if (selectedNote) {
    previousNote.value = currentNote.value;
    currentNote.value = selectedNote;
  } else {
    console.error("Failed to select a valid note");
    previousNote.value = currentNote.value;
    currentNote.value = "c/4";
  }
};

const handleGuess = (guess: string) => {
  if (feedback.value === "correct") return;

  const correctNoteName = currentNote.value.charAt(0);
  if (guess.toLowerCase() === correctNoteName) {
    feedback.value = "correct";
    setTimeout(() => {
      generateNewNote();
    }, 600);
  } else {
    feedback.value = "incorrect";
    setTimeout(() => {
      feedback.value = "waiting";
    }, 800);
  }
};

const keyMap: { [key: string]: string } = {
  "1": "c",
  "2": "d",
  "3": "e",
  "4": "f",
  "5": "g",
  "6": "a",
  "7": "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  a: "a",
  b: "b",
};

onKeyStroke(Object.keys(keyMap), (e) => {
  if (!deviceIsMobile.value) {
    const guess = keyMap[e.key.toLowerCase() as keyof typeof keyMap];
    if (guess) {
      e.preventDefault();
      handleGuess(guess);
    }
  }
});

onMounted(() => {
  deviceIsMobile.value = isMobile();
  generateNewNote();
});

const containerClass = computed(() => {
  switch (feedback.value) {
    case "correct":
      return "bg-green-500/10 border-green-500/30";
    case "incorrect":
      return "bg-red-500/10 border-red-500/30";
    default:
      return "bg-slate-800/30 border-slate-700/50";
  }
});
</script>

<template>
  <div class="flex h-screen flex-col bg-slate-900 text-white">
    <div
      class="flex flex-1 flex-col items-center justify-center space-y-12 p-8"
    >
      <div class="flex justify-center gap-12">
        <label class="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            v-model="clefSetting"
            value="treble"
            @change="generateNewNote"
            class="h-4 w-4 border-2 border-gray-400 bg-transparent text-blue-500 focus:ring-blue-500"
          />
          <span class="text-lg text-gray-300">Treble</span>
        </label>

        <label class="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            v-model="clefSetting"
            value="bass"
            @change="generateNewNote"
            class="h-4 w-4 border-2 border-gray-400 bg-transparent text-blue-500 focus:ring-blue-500"
          />
          <span class="text-lg text-gray-300">Bass</span>
        </label>
      </div>

      <div class="flex justify-center">
        <div
          :class="containerClass"
          class="rounded-lg border-2 p-8 transition-all duration-300"
        >
          <SingleNote :note="currentNote" :clef="currentClef" />
        </div>
      </div>
    </div>

    <div class="px-8 pb-8">
      <div class="flex justify-center gap-4">
        <button
          v-for="note in noteNames"
          :key="note"
          class="h-16 w-16 rounded-lg border border-slate-600 bg-slate-700 text-xl font-semibold text-white uppercase transition-all hover:bg-slate-600 active:scale-95"
          @click="handleGuess(note)"
        >
          {{ note }}
        </button>
      </div>
    </div>
  </div>
</template>
