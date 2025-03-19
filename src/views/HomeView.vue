<template>
  <div class="container">
    <div class="overlay">
      <div class="card-container">
        <div
          v-for="(imgD, index) in data"
          :key="imgD.id"
          :ref="(el) => setCardRef(el, `card${imgD.id}`)"
          @mousedown="(e) => index === 0 && startMoveCard(e, `card${imgD.id}`, imgD.id)"
          class="card"
          :class="{ grabbed: isGrab }"
          :style="index !== 0 && { zIndex: 100 - index }"
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
import { ref, onMounted, onUnmounted } from 'vue'

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
const actuailId = ref('')

//estilos imagen
const position = ref('')
const porcentaje = ref(0)

//Mounted
onMounted(() => {
  document.addEventListener('mouseup', leaveCard)
  document.addEventListener('mousemove', mouveCard)
})
onUnmounted(() => {
  document.removeEventListener('mouseup', leaveCard)
  document.removeEventListener('mousemove', mouveCard)
})

const startMoveCard = (e, ref, id) => {
  clientXMove.value = e.clientX
  actualidRef.value = ref
  actuailId.value = id
  isGrab.value = true
  cardRefs.value[actualidRef.value].style.transition = ''
}

const mouveCard = (e) => {
  if (!isGrab.value) return

  if (e.clientX > clientXMove.value && translateNumber.value < 240) {
    translateNumber.value += 4
    rotationValue.value += 1
  }
  if (e.clientX < clientXMove.value && translateNumber.value > -240) {
    translateNumber.value -= 4
    rotationValue.value -= 1
  }

  clientXMove.value = e.clientX
  position.value = translateNumber.value < 0 ? 'right' : 'left'
  porcentaje.value = Math.abs(translateNumber.value / 3)

  cardRefs.value[actualidRef.value].style.transform =
    `translateX(${translateNumber.value}px) rotate(${rotationValue.value}deg)`
}

const leaveCard = () => {
  isGrab.value = false
  let isFinishCard = false
  if (Math.abs(translateNumber.value) > 140) {
    //quitamos la carta

    data.value = data.value.filter((item) => item.id !== actuailId.value)
    isFinishCard = true
  }
  translateNumber.value = 0
  rotationValue.value = 0
  clientXMove.value = null
  position.value = ''
  porcentaje.value = 0
  if (!isFinishCard) {
    cardRefs.value[actualidRef.value].style.transition = 'transform 0.5s ease-out'
    cardRefs.value[actualidRef.value].style.transform =
      `translateX(${translateNumber.value}px) rotate(${rotationValue.value}deg)`
  }
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
  overflow: hidden;
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
      display: block;
      width: 70vw;
      height: 80vh;
      max-width: 250px;
      max-height: 400px;

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

  .grabbed {
    cursor: grabbing !important;
  }
  .card:first-child {
    z-index: 99999;
  }
}
</style>
