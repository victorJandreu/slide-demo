<template>
  <div class="container">
    <div class="overlay">
      <div v-show="isLoading" class="container-spinner">
        <VueSpinner size="40" color="cadetblue" />
      </div>

      <div v-show="!isLoading" class="card-container">
        <div
          v-for="(imgD, index) in data"
          :key="imgD.id"
          :ref="(el) => setCardRef(el, `card${imgD.id}`)"
          @mousedown="(e) => index === 0 && startMoveCard(e, `card${imgD.id}`, imgD.id)"
          @touchstart.passive="(e) => index === 0 && startMoveCard(e, `card${imgD.id}`, imgD.id)"
          class="card"
          :class="{ grabbed: isGrab }"
          :style="index !== 0 && { zIndex: 100 - index }"
        >
          <div
            :style="
              index === 0 &&
              isGrab && {
                maskImage: `linear-gradient(to ${position}, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) ${porcentaje}%)`,
              }
            "
          >
            <img
              @load="onImageLoad(index)"
              v-if="index === 0 || index === 1"
              :src="imgD.image"
              alt="imagen"
            />
            <img
              v-if="index === 0 && translateNumber > 0"
              class="icon"
              :style="{ opacity: iconOpacity }"
              src="../../public/heart.svg"
              alt="heart"
            />
            <img
              v-if="index === 0 && translateNumber < 0"
              class="icon"
              :style="{ opacity: iconOpacity }"
              src="../../public/cancel.svg"
              alt="not choosed"
            />
          </div>
        </div>
        <div v-if="data.length <= 1" class="card">
          <div class="paraggraf-container">
            <p>Oops! No more people for today. Come back tomorrow</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import imgData from '../stores/imgData.json'
import { ref, onMounted, onUnmounted } from 'vue'
import { VueSpinner } from 'vue3-spinners'
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
const isTouch = ref(false)
const data = ref(imgData)
const translateNumber = ref(0)
const rotationValue = ref(0)
const clientXMove = ref(null)
const actuailId = ref('')

//estilos imagen
const position = ref('')
const porcentaje = ref(0)
const iconOpacity = ref(0)
const isLoading = ref(true)
const countLoadImg = ref(0)

//Mounted
onMounted(() => {
  document.addEventListener('mouseup', leaveCard)
  document.addEventListener('mousemove', mouveCard)
  document.addEventListener('touchend', leaveCard)
  document.addEventListener('touchmove', mouveCard)
})
onUnmounted(() => {
  document.removeEventListener('mouseup', leaveCard)
  document.removeEventListener('mousemove', mouveCard)
  document.removeEventListener('touchend', leaveCard)
  document.removeEventListener('touchmove', mouveCard)
})

const onImageLoad = () => {
  countLoadImg.value++
  if (countLoadImg.value === 2) {
    isLoading.value = false
  }
}

const startMoveCard = (e, ref, id) => {
  isTouch.value = e.type === 'touchstart' ? true : false

  clientXMove.value = isTouch.value ? e.touches[0].clientX : e.clientX
  actualidRef.value = ref
  actuailId.value = id
  isGrab.value = true
  cardRefs.value[actualidRef.value].style.transition = ''
}

const mouveCard = (e) => {
  if (!isGrab.value) return

  const moveClientX = isTouch.value ? e.touches[0].clientX : e.clientX

  if (moveClientX > clientXMove.value && translateNumber.value < 240) {
    translateNumber.value += 4
    rotationValue.value += 1
  }
  if (moveClientX < clientXMove.value && translateNumber.value > -240) {
    translateNumber.value -= 4
    rotationValue.value -= 1
  }

  iconOpacity.value = Math.abs(translateNumber.value) / 95

  clientXMove.value = moveClientX
  position.value = translateNumber.value < 0 ? 'right' : 'left'
  porcentaje.value = Math.abs(translateNumber.value / 3)

  cardRefs.value[actualidRef.value].style.transform =
    `translateX(${translateNumber.value}px) rotate(${rotationValue.value}deg)`
}

const leaveCard = () => {
  isGrab.value = false
  let isFinishCard = false

  if (Math.abs(translateNumber.value) > 95) {
    //leave the card
    disapearEffect()
    setTimeout(() => {
      clearValuesData()
      data.value = data.value.filter((item) => item.id !== actuailId.value)
      isFinishCard = true
    }, 100)
  }

  if (!isFinishCard) {
    //return the card
    clearValuesData()
    cardRefs.value[actualidRef.value].style.transition = 'transform  0.5s ease-out'
    cardRefs.value[actualidRef.value].style.transform = `translateX(${translateNumber.value}px) `
  }
}
const clearValuesData = () => {
  translateNumber.value = 0
  rotationValue.value = 0
  clientXMove.value = null
  position.value = ''
  porcentaje.value = 0
  iconOpacity.value = 0
}

const disapearEffect = () => {
  const card = cardRefs.value[actualidRef.value]
  const traslateData = translateNumber.value
  const rotateData = rotationValue.value

  if (!card) return

  requestAnimationFrame(() => {
    const translateRotate =
      traslateData > 0
        ? { translate: translateNumber.value + 450 }
        : { translate: translateNumber.value - 450 }

    card.style.transition = 'transform .5s ease-out, opacity .3s ease-out'
    card.style.transform = `translateX(${translateRotate.translate}px) rotate(${rotateData}deg)`
    card.style.opacity = '0'
  })
}

const heigthForMobile = () => {
  document.documentElement.style.setProperty('--altura-real', `${window.innerHeight}px`)
}

onMounted(() => {
  heigthForMobile()

  window.addEventListener('resize', heigthForMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', heigthForMobile)
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: var(--altura-real, 100vh);
  overflow: hidden;
  background: linear-gradient(to bottom, #302929, #1a1a1a, #333333);
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
  }
}
img,
.paraggraf-container,
.container-spinner {
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

.container-spinner {
  display: flex;
  justify-content: center;
}

.paraggraf-container {
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    text-align: center;
    margin: 0;
    line-height: 1.3;
    color: rgba(255, 245, 226, 0.823);
    margin: 10px;
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

.icon {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
}
</style>
