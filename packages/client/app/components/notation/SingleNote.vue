<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";
import { useResizeObserver } from "@vueuse/core";
import { isMobile } from "is-mobile";

const props = defineProps({
  note: {
    type: String,
    required: true,
  },
  clef: {
    type: String,
    required: true,
    validator: (value: string) => ["treble", "bass"].includes(value),
  },
});

const notationContainer = ref<HTMLDivElement | null>(null);

const renderNote = () => {
  if (!notationContainer.value || !props.note) return;
  notationContainer.value.innerHTML = "";

  const FALLBACK_WIDTH = isMobile() ? 300 : 400;

  console.log(FALLBACK_WIDTH);

  const containerWidth = notationContainer.value.offsetWidth;
  const rendererWidth = containerWidth > 0 ? containerWidth : FALLBACK_WIDTH;
  const staveWidth = rendererWidth - 20; // 10px padding on each side

  try {
    const renderer = new Renderer(
      notationContainer.value,
      Renderer.Backends.SVG
    );
    renderer.resize(rendererWidth, 250);
    const context = renderer.getContext();
    context.setStrokeStyle("#ffffff");
    context.setFillStyle("#ffffff");

    const stave = new Stave(10, 30, staveWidth, { spacingBetweenLinesPx: 17 });

    stave.addClef(props.clef);
    stave.setContext(context).draw();

    const staveNote = new StaveNote({
      keys: [props.note],
      duration: "q",
      clef: props.clef,
      alignCenter: true,
    });

    staveNote.setStyle({
      fillStyle: "#ffffff",
      strokeStyle: "#ffffff",
    });

    const voice = new Voice({ numBeats: 1, beatValue: 4 });
    voice.setStrict(false);
    voice.addTickables([staveNote]);

    const formatter = new Formatter().joinVoices([voice]);
    const availableWidth = stave.getNoteEndX() - stave.getNoteStartX();
    formatter.format(
      [voice],
      availableWidth > 0 ? availableWidth : staveWidth - 20
    );

    voice.draw(context, stave);

    const svg = notationContainer.value.querySelector("svg");
    if (svg) {
      const allElements = svg.querySelectorAll("*");
      allElements.forEach((element) => {
        element.setAttribute("stroke", "#ffffff");
        element.setAttribute("fill", "#ffffff");
      });
    }
  } catch (error) {
    console.error("VexFlow Error:", error);
    if (notationContainer.value) {
      notationContainer.value.innerHTML =
        '<p class="text-red-400 p-4 text-center">Invalid Note</p>';
    }
  }
};

onMounted(async () => {
  await nextTick();
  renderNote();
});
watch([() => props.note, () => props.clef], renderNote);
useResizeObserver(notationContainer, renderNote);
</script>

<template>
  <div
    ref="notationContainer"
    class="flex min-h-[250px] w-full items-center justify-center"
  />
</template>
