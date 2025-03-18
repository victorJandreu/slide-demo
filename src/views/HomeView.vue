<template>
  <div class="container">
    <div class="overlay">
      <div class="card-container">
        <div
          v-for="(imgD, index) in data"
          :key="imgD.id"
          :ref="(el) => setCardRef(el, `card${imgD.id}`)"
          @mousedown="(e) => index === 0 && startMoveCard(e, `card${imgD.id}`)"
          class="card"
          :class="{ grabbed: isGrab }"
        >
          <div
            class="card-imag"
            :style="
              index === 0 &&
              isGrab && {
                maskImage: `linear-gradient(to ${position}, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) ${porcentaje}%)`,
              }
            "
          >
            <img :src="imgD.image" alt="imagen" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import imgData from '../stores/imgData.json'
import { ref, onMounted } from 'vue'

//referencias card
const actualidRef = ref('')
const cardRefs = ref({})
const setCardRef = (el, id) => {
  if (el) {
    cardRefs.value[id] = el
  }
}

//imagenes - data
const isGrab = ref(false)
const data = ref(imgData)
const translateNumber = ref(0)
const rotationValue = ref(0)
const clientXMove = ref(null)
//estilos imagen
const position = ref('')
const porcentaje = ref(0)

//Mounted
onMounted(() => {
  document.addEventListener('mouseup', () => {
    isGrab.value = false
    translateNumber.value = 0
    rotationValue.value = 0
    clientXMove.value = null
    position.value = ''
    porcentaje.value = 0
    cardRefs.value[actualidRef.value].style.transition = 'transform 0.5s ease-out'
    cardRefs.value[actualidRef.value].style.transform =
      `translateX(${translateNumber.value}px) rotate(${rotationValue.value}deg)`
  })
  document.addEventListener('mousemove', mouveCard)
})

const startMoveCard = (e, ref) => {
  clientXMove.value = e.clientX
  actualidRef.value = ref
  isGrab.value = true
  cardRefs.value[actualidRef.value].style.transition = ''
}

const mouveCard = (e) => {
  if (!isGrab.value) return

  if (e.clientX > clientXMove.value) {
    translateNumber.value += 4
    rotationValue.value += 1
  } else {
    translateNumber.value -= 4
    rotationValue.value -= 1
  }

  clientXMove.value = e.clientX
  position.value = translateNumber.value < 0 ? 'right' : 'left'
  porcentaje.value = Math.abs(translateNumber.value / 3)

  cardRefs.value[actualidRef.value].style.transform =
    `translateX(${translateNumber.value}px) rotate(${rotationValue.value}deg)`
}
</script>

<style scoped lang="scss">
.container {
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #000000, #1a1a1a, #333333);
}

.overlay {
  width: 100vw;
  display: flex;
  justify-content: center;
  overflow: auto;
}

.card-container {
  border-radius: 4px;
  border: 3px solid cadetblue;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  .card {
    position: relative;
    cursor: grab;
    display: grid;
    border-radius: 4px;
    grid-column: 1 /2;
    grid-row: 1 / 2;
    user-select: none;

    img {
      width: 270px;
      height: 100%;
      object-fit: cover;
      user-select: none;
      pointer-events: none;
      display: block;
    }
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    pointer-events: none;
  }

  .img-container .grabbed {
    cursor: grabbing !important;
  }
  .card:first-child {
    order: 0;
  }

  .card:nth-child(n + 2) {
    order: -1;
  }
}
</style>
