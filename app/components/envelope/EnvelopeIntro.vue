<script setup lang="ts">
import { useReducedMotion } from '@vueuse/motion'

const props = defineProps<{
  coupleName: string
  dateLabel: string
  guestName?: string | null
  partnerName?: string | null
  /** Personal background photo for the invitation card. */
  backgroundImage?: string | null
}>()

// For couple invitations, greet both by name.
const displayGuest = computed(() =>
  props.partnerName
    ? `${props.guestName} та ${props.partnerName}`
    : props.guestName,
)

const emit = defineEmits<{ opened: [] }>()

type Phase = 'idle' | 'opening' | 'leaving'
const phase = ref<Phase>('idle')
const reduced = useReducedMotion()

// --- Interactive 3D tilt following the pointer --------------------------
const stage = ref<HTMLElement | null>(null)
const tilt = reactive({ x: 0, y: 0, hover: false })

function onMove(e: PointerEvent) {
  if (reduced.value || phase.value !== 'idle' || !stage.value) return
  const r = stage.value.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  tilt.x = -py * 14
  tilt.y = px * 16
  tilt.hover = true
}
function onLeave() {
  tilt.x = 0
  tilt.y = 0
  tilt.hover = false
}
const tiltStyle = computed(() => ({
  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
}))

// --- Open sequence -------------------------------------------------------
// 0ms      seal breaks off and falls
// 250ms    flap swings open (patterned liner revealed)
// 550ms    letter rises out, then settles in front, scaled up
// 2600ms   overlay starts fading
// 3400ms   done → hero
function open() {
  if (phase.value !== 'idle') return
  if (reduced.value) {
    emit('opened')
    return
  }
  onLeave()
  phase.value = 'opening'
  // letter finishes at ~3.5s (1.5s delay + 2s), hold a beat, then fade
  setTimeout(() => (phase.value = 'leaving'), 3900)
  setTimeout(() => emit('opened'), 4700)
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="envelope-overlay" :class="{ 'is-leaving': phase === 'leaving' }">
    <!-- Personal photo as the page background, softened by a paper-toned
         veil so the envelope and text stay legible. -->
    <div
      v-if="backgroundImage"
      class="overlay-photo"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      aria-hidden="true"
    />

    <div class="relative mx-auto flex min-h-[100svh] flex-col items-center justify-center gap-10 px-6">
      <Transition name="fade">
        <p v-if="phase === 'idle' && guestName" class="text-center font-serif text-lg text-espresso/70">
          {{ displayGuest }}, для вас особисте запрошення
        </p>
      </Transition>

      <div
        ref="stage"
        class="stage"
        :class="{ 'is-hover': tilt.hover }"
        @pointermove="onMove"
        @pointerleave="onLeave"
      >
        <button
          class="envelope-scene"
          :class="{ 'is-opening': phase !== 'idle', 'is-idle': phase === 'idle' }"
          :aria-label="phase === 'idle' ? 'Відкрити запрошення' : 'Відкриваємо…'"
          @click="open"
        >
          <div class="envelope" :style="tiltStyle">
            <!-- Inside back of the envelope (visible once the flap opens) -->
            <div class="env-inside" />

            <!-- The invitation card -->
            <div class="letter">
              <span class="letter-frame" aria-hidden="true" />
              <p class="letter-eyebrow">Запрошення на весілля</p>
              <p class="letter-names font-script">{{ coupleName }}</p>
              <div class="letter-rule" aria-hidden="true">
                <span class="letter-rule-line" />
                <span class="letter-diamond" />
                <span class="letter-rule-line" />
              </div>
              <p class="letter-date font-serif">{{ dateLabel }}</p>
              <p class="letter-note font-serif">Будемо щасливі розділити цей день із вами</p>
            </div>

            <!-- Folded-in side & bottom flaps of the envelope back -->
            <div class="env-side env-side--left" />
            <div class="env-side env-side--right" />
            <div class="env-bottom" />

            <!-- Calligraphic inscription pressed into the paper -->
            <p class="env-inscription font-script" aria-hidden="true">
              Запрошення на весілля
            </p>

            <!-- Top flap: outer paper + patterned liner on the inside.
                 The wrapper isolates 3D perspective so the rest of the
                 envelope keeps plain z-index stacking. -->
            <div class="flap-3d">
              <div class="env-flap">
                <div class="flap-face flap-face--outer" />
                <div class="flap-face flap-face--liner" />
              </div>
            </div>

            <!-- Carmine wax seal with the Д·О monogram -->
            <div class="seal-wrap" aria-hidden="true">
              <svg class="seal-svg" viewBox="-12 -12 124 124" role="img">
                <defs>
                  <radialGradient id="waxBody" cx="36%" cy="28%" r="85%">
                    <stop offset="0%" stop-color="#d76a63" />
                    <stop offset="30%" stop-color="#b93a44" />
                    <stop offset="62%" stop-color="#96202e" />
                    <stop offset="100%" stop-color="#5f0f1a" />
                  </radialGradient>
                  <radialGradient id="waxIn" cx="42%" cy="34%" r="75%">
                    <stop offset="0%" stop-color="#a83741" />
                    <stop offset="100%" stop-color="#69101c" />
                  </radialGradient>
                  <radialGradient id="waxHi" cx="42%" cy="30%" r="80%">
                    <stop offset="0%" stop-color="#e89e93" />
                    <stop offset="55%" stop-color="#cd5f62" />
                    <stop offset="100%" stop-color="#a92e3b" />
                  </radialGradient>
                  <radialGradient id="waxGloss" cx="44%" cy="36%" r="58%">
                    <stop offset="0%" stop-color="#fff" stop-opacity="0.5" />
                    <stop offset="55%" stop-color="#fff" stop-opacity="0.07" />
                    <stop offset="100%" stop-color="#fff" stop-opacity="0" />
                  </radialGradient>

                  <!-- irregular molten-wax edge -->
                  <filter id="waxEdge" x="-30%" y="-30%" width="160%" height="160%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.021 0.028" numOctaves="3" seed="14" result="e" />
                    <feDisplacementMap in="SourceGraphic" in2="e" scale="10" xChannelSelector="R" yChannelSelector="G" />
                  </filter>

                  <!-- waxy bumped surface via specular lighting -->
                  <filter id="waxSurface" x="-30%" y="-30%" width="160%" height="160%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="3" seed="7" result="b" />
                    <feGaussianBlur in="b" stdDeviation="0.6" result="bb" />
                    <feSpecularLighting in="bb" surfaceScale="2.2" specularConstant="0.8"
                      specularExponent="15" lighting-color="#ffd9d0" result="s">
                      <fePointLight x="-30" y="-40" z="90" />
                    </feSpecularLighting>
                    <feComposite in="s" in2="SourceAlpha" operator="in" />
                  </filter>

                  <!-- raised-relief look for the stamped design -->
                  <filter id="sealRelief" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0.8" stdDeviation="0.4" flood-color="#3c0812" flood-opacity="0.8" />
                    <feDropShadow dx="0" dy="-0.5" stdDeviation="0.3" flood-color="#f2a09b" flood-opacity="0.5" />
                  </filter>
                </defs>

                <g filter="url(#waxEdge)">
                  <!-- wax body (slightly non-circular) + molten drips -->
                  <path
                    d="M50 3
                       C66 2 79 10 88 24 C95 35 98 50 91 65
                       C86 79 72 90 56 92 C41 94 25 89 15 78
                       C5 67 2 51 7 36 C11 22 25 9 41 5 C44 4 47 3 50 3 Z"
                    fill="url(#waxBody)"
                  />
                  <ellipse cx="90" cy="60" rx="5.5" ry="3.6" fill="url(#waxBody)" />
                  <ellipse cx="12" cy="32" rx="4" ry="2.8" fill="url(#waxBody)" />
                  <ellipse cx="58" cy="94" rx="4.4" ry="2.6" fill="url(#waxBody)" />

                  <!-- surface sheen bumps -->
                  <path
                    d="M50 3 C66 2 79 10 88 24 C95 35 98 50 91 65 C86 79 72 90 56 92
                       C41 94 25 89 15 78 C5 67 2 51 7 36 C11 22 25 9 41 5 C44 4 47 3 50 3 Z"
                    fill="#000"
                    filter="url(#waxSurface)"
                    opacity="0.7"
                  />

                  <!-- pressed stamp disc -->
                  <circle cx="50" cy="50" r="34" fill="url(#waxIn)" opacity="0.95" />
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#4a0a14" stroke-opacity="0.5" stroke-width="1.5" />
                  <circle cx="50" cy="50" r="31.5" fill="none" stroke="#d97c76" stroke-opacity="0.35" stroke-width="0.8" />

                  <!-- stamped monogram: Д · О inside a beaded ring -->
                  <g filter="url(#sealRelief)">
                    <circle
                      cx="50" cy="50" r="27" fill="none"
                      stroke="url(#waxHi)" stroke-width="1.8"
                      stroke-dasharray="0.1 3.5" stroke-linecap="round"
                    />
                    <text x="31.5" y="61.5" text-anchor="middle" class="seal-letter" fill="url(#waxHi)">Д</text>
                    <text x="68.5" y="61.5" text-anchor="middle" class="seal-letter" fill="url(#waxHi)">О</text>
                    <rect
                      x="47.8" y="47.3" width="4.4" height="4.4"
                      transform="rotate(45 50 49.5)" fill="url(#waxHi)"
                    />
                  </g>

                  <!-- broad gloss + hotspot -->
                  <ellipse cx="40" cy="32" rx="27" ry="18" fill="url(#waxGloss)" />
                  <ellipse cx="33" cy="27" rx="6" ry="3.2" fill="#fff" opacity="0.35" />
                </g>
              </svg>
            </div>
          </div>
        </button>
      </div>

      <Transition name="fade">
        <p
          v-if="phase === 'idle'"
          class="animate-pulse text-center font-sans text-xs tracking-[0.3em] text-olive-600 uppercase"
        >
          Натисніть, щоб відкрити
        </p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------ *
 * Paper tones — warm ecru wedding envelope
 * ------------------------------------------------------------------ */
.envelope-overlay {
  --paper-hi: #f6ecd4;
  --paper: #ecdfc0;
  --paper-lo: #ddcba3;
  --paper-shade: rgba(120, 95, 55, 0.3);
  --grain:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");

  position: fixed;
  inset: 0;
  z-index: 90;
  background: radial-gradient(135% 105% at 50% 16%, #fffdf6 0%, #f7efdc 52%, #ecdfc6 100%);
  transition: opacity 0.8s var(--ease-soft), filter 0.8s var(--ease-soft);
}
.envelope-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(100% 100% at 50% 46%, transparent 52%, rgba(75, 51, 39, 0.15) 100%);
  pointer-events: none;
}
.envelope-overlay.is-leaving {
  opacity: 0;
  filter: blur(6px);
  pointer-events: none;
}

/* --- Personal background photo --------------------------------------- */
.overlay-photo {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}
/* paper-toned veil over the photo, matching the default backdrop */
.overlay-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    135% 105% at 50% 16%,
    rgba(255, 253, 246, 0.78) 0%,
    rgba(247, 239, 220, 0.62) 52%,
    rgba(236, 223, 198, 0.72) 100%
  );
}

.stage {
  position: relative;
  width: min(88vw, 470px);
  aspect-ratio: 1.47 / 1;
  display: grid;
  place-items: center;
}

.envelope-scene {
  --w: min(88vw, 470px);
  width: var(--w);
  height: calc(var(--w) * 0.68);
  perspective: 1400px;
  cursor: pointer;
  background: transparent;
  border: 0;
  z-index: 10;
}
.envelope-scene.is-idle {
  animation: float 6s var(--ease-soft) infinite;
}
.envelope-scene.is-opening {
  animation: none;
  cursor: default;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

.envelope {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.35s var(--ease-soft), filter 0.4s var(--ease-soft);
  filter: drop-shadow(0 26px 34px rgba(88, 68, 40, 0.3));
}
.stage.is-hover .envelope {
  filter: drop-shadow(0 40px 56px rgba(88, 68, 40, 0.38));
}

/* --- Inside back, visible through the opening ---------------------- */
.env-inside {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 8px;
  background-image: var(--grain), linear-gradient(175deg, #dcc9a2 0%, #cdb98d 100%);
  background-size: 160px 160px, auto;
  background-blend-mode: soft-light, normal;
  box-shadow:
    inset 0 0 0 1px var(--paper-shade),
    inset 0 8px 18px rgba(90, 68, 38, 0.28);
}

/* --- Folded-in flaps of the envelope back -------------------------- *
 * Each flap catches the light differently, like real folded paper.   */
.env-side,
.env-bottom {
  position: absolute;
  inset: 0;
  background-size: 160px 160px, auto;
  background-blend-mode: soft-light, normal;
  filter: drop-shadow(0 1px 1.5px rgba(90, 70, 42, 0.28));
}
.env-side { z-index: 4; }
.env-side--left {
  clip-path: polygon(0 0, 55% 50%, 0 100%);
  background-image: var(--grain), linear-gradient(105deg, var(--paper-hi) 0%, var(--paper) 78%);
  border-radius: 8px 0 0 8px;
}
.env-side--right {
  clip-path: polygon(100% 0, 45% 50%, 100% 100%);
  background-image: var(--grain), linear-gradient(255deg, var(--paper) 0%, var(--paper-lo) 82%);
  border-radius: 0 8px 8px 0;
}
.env-bottom {
  z-index: 5;
  clip-path: polygon(0 100%, 50% 42%, 100% 100%);
  background-image: var(--grain), linear-gradient(178deg, var(--paper-hi) 30%, var(--paper) 100%);
  border-radius: 0 0 8px 8px;
}
/* --- Inscription on the envelope ------------------------------------- */
.env-inscription {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5.5%;
  z-index: 6;
  text-align: center;
  font-size: calc(var(--w, 470px) * 0.055);
  line-height: 1.2;
  color: rgba(75, 51, 39, 0.75);
  /* letterpress: pressed into the paper */
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.55),
    0 -1px 1px rgba(90, 70, 42, 0.22);
  pointer-events: none;
  transition: opacity 0.5s var(--ease-soft);
}
.is-opening .env-inscription {
  opacity: 0;
}

/* soft crease shadow where the bottom flap folds over the side ones */
.env-bottom::after {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: polygon(0 100%, 50% 42%, 100% 100%);
  background: linear-gradient(180deg, rgba(90, 70, 42, 0.14) 42%, transparent 62%);
}

/* --- Top flap (rotates open) ---------------------------------------- */
.flap-3d {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* Taller than the flap so its tip shadow isn't clipped; anything the
     flap projects above the fold line is cut off, so once it passes 90°
     it vanishes behind the envelope's top edge — folded flat against
     the back, out of sight. */
  height: 75%;
  z-index: 6;
  overflow: hidden;
  perspective: 700px;
  perspective-origin: 50% 40%;
}
.env-flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 82.7%; /* 62% of the envelope, inside the 75% wrapper */
  transform-origin: top center;
  transform: rotateX(0deg);
  transform-style: preserve-3d;
}
.flap-face {
  position: absolute;
  inset: 0;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  backface-visibility: hidden;
  background-size: 160px 160px, auto;
  background-blend-mode: soft-light, normal;
}
.flap-face--outer {
  background-image: var(--grain), linear-gradient(168deg, var(--paper-hi) 0%, var(--paper-lo) 100%);
  border-radius: 8px 8px 0 0;
  filter: drop-shadow(0 2px 2.5px rgba(90, 70, 42, 0.3));
}
/* darkening toward the tip for a folded look */
.flap-face--outer::after {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, transparent 22%, rgba(90, 70, 42, 0.16) 100%);
}
/* patterned liner — the wedding detail revealed when the flap opens */
.flap-face--liner {
  transform: rotateX(180deg);
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='%23909c78' opacity='0.85'%3E%3Cellipse cx='18' cy='14' rx='7' ry='2.6' transform='rotate(-32 18 14)'/%3E%3Cellipse cx='26' cy='22' rx='7' ry='2.6' transform='rotate(-32 26 22)'/%3E%3Cellipse cx='54' cy='50' rx='7' ry='2.6' transform='rotate(148 54 50)'/%3E%3Cellipse cx='62' cy='58' rx='7' ry='2.6' transform='rotate(148 62 58)'/%3E%3Ccircle cx='58' cy='16' r='1.8'/%3E%3Ccircle cx='14' cy='56' r='1.8'/%3E%3C/g%3E%3C/svg%3E"),
    linear-gradient(180deg, #f6ecd4 0%, #ecdfc2 100%);
  background-size: 64px 64px, auto;
  box-shadow: inset 0 0 0 1px rgba(120, 95, 55, 0.18);
}
/* The flap resists at first (wax giving way), then folds back over the
   top edge and stands slightly tilted, like a real opened envelope. */
.is-opening .env-flap {
  animation: flap-open 1.3s cubic-bezier(0.55, 0.06, 0.35, 1) 0.28s forwards;
}
@keyframes flap-open {
  0% { transform: rotateX(0deg); }
  18% { transform: rotateX(-14deg); }
  100% { transform: rotateX(-106deg); }
}
/* the outer face's shadow flips with it and would point upward — drop it */
.is-opening .flap-face--outer {
  filter: none;
  transition: filter 0.3s linear 0.7s;
}
/* the envelope dips slightly as the flap tears free */
.is-opening .envelope {
  animation: env-react 0.9s var(--ease-soft) 0.2s;
}
@keyframes env-react {
  0% { transform: rotateX(0) translateY(0); }
  35% { transform: rotateX(5deg) translateY(4px); }
  100% { transform: rotateX(0) translateY(0); }
}

/* --- Wax seal -------------------------------------------------------- */
.seal-wrap {
  position: absolute;
  top: 60%;
  left: 50%;
  z-index: 8;
  width: 31%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
}
.seal-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  /* No hover transform here: scaling an SVG full of filters forces a
     blurry re-raster. The shadow deepens instead. */
  filter: drop-shadow(0 5px 9px rgba(90, 12, 22, 0.45));
  transition: filter 0.4s var(--ease-soft);
}
.stage.is-hover .seal-svg {
  filter: drop-shadow(0 8px 13px rgba(90, 12, 22, 0.55));
}
.seal-letter {
  font-family: 'Cormorant Garamond', ui-serif, Georgia, serif;
  font-size: 32px;
  font-weight: 700;
}
/* the seal breaks free and falls when clicked */
.is-opening .seal-wrap {
  /* NB: cubic-bezier x-values must stay within [0,1] or the whole
     animation is discarded as invalid CSS */
  animation: seal-pop 1.5s cubic-bezier(0.5, 0, 0.8, 0.4) forwards;
}
@keyframes seal-pop {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
    opacity: 1;
  }
  18% {
    transform: translate(-50%, -54%) rotate(-5deg) scale(1.07);
    opacity: 1;
  }
  82% {
    opacity: 1;
  }
  100% {
    transform: translate(-38%, 290%) rotate(40deg) scale(0.94);
    opacity: 0;
  }
}

/* --- The invitation card --------------------------------------------- */
.letter {
  position: absolute;
  left: 8%;
  right: 8%;
  top: 9%;
  bottom: 9%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1.5rem 1.25rem;
  border-radius: 5px;
  background:
    linear-gradient(180deg, #fffefb 0%, #faf4e6 100%);
  box-shadow: 0 10px 28px rgba(70, 52, 32, 0.24);
  transform: scale(0.84);
}
/* double hairline frame, like a printed invitation */
.letter-frame {
  position: absolute;
  inset: 7px;
  border: 1px solid color-mix(in srgb, var(--color-brass) 55%, transparent);
  border-radius: 3px;
  pointer-events: none;
}
.letter-frame::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid color-mix(in srgb, var(--color-brass) 28%, transparent);
  border-radius: 2px;
}
.letter-eyebrow {
  font-family: var(--font-sans);
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: var(--color-olive-600);
}
.letter-names {
  margin-top: 0.35rem;
  font-size: clamp(1.9rem, 7.5vw, 2.9rem);
  line-height: 1.15;
  color: var(--color-espresso);
}
.letter-rule {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.4rem 0;
}
.letter-rule-line {
  width: 2.6rem;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-brass) 50%, transparent);
}
.letter-diamond {
  width: 5px;
  height: 5px;
  transform: rotate(45deg);
  background: var(--color-brass);
  opacity: 0.75;
}
.letter-date {
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  color: var(--color-cocoa);
}
.letter-note {
  font-size: 0.8rem;
  font-style: italic;
  color: color-mix(in srgb, var(--color-cocoa) 75%, transparent);
}
/* rise out of the pocket, then settle in front, full size */
.is-opening .letter {
  animation: letter-out 2s var(--ease-soft) 1.5s forwards;
}
@keyframes letter-out {
  0% { transform: translateY(0) scale(0.84); z-index: 2; }
  52% { transform: translateY(-74%) scale(0.9); z-index: 2; }
  60% { z-index: 40; }
  100% { transform: translateY(-6%) scale(1); z-index: 40; }
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.5s var(--ease-soft); }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .envelope-scene,
  .env-flap,
  .letter,
  .seal-wrap,
  .envelope { transition: none; animation: none; }
}
</style>
