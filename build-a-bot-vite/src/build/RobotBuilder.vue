<template>
  <div>
    <div>
      <div class="content">
        <div class="preview">
          <CollapsibleSection>
            <div class="preview-content">
              <div class="top-row">
                <img :src="selectedRobot.head.imageUrl" />
              </div>
              <div class="middle-row">
                <img :src="selectedRobot.leftArm.imageUrl" class="rotate-left" />
                <img :src="selectedRobot.torso.imageUrl" />
                <img :src="selectedRobot.rightArm.imageUrl" class="rotate-right" />
              </div>
              <div class="bottom-row">
                <img :src="selectedRobot.base.imageUrl" />
              </div>
            </div>
          </CollapsibleSection>
          <button class="add-to-cart" @click="addToCart()">Add to Cart</button>
        </div>

        <div class="top-row">
          <div :class="[saleBorderClass, 'top', 'part']">
            <div class="robot-name">
              {{ selectedRobot.head.title }}
              <span v-if="selectedRobot.head.onSale" class="sale">Sale!</span>
            </div>
            <PartSelector
              :parts="availableParts.heads"
              position="top"
              @partSelected="(part) => (selectedRobot.head = part)"
            />
          </div>
        </div>
      </div>
      <div class="middle-row">
        <PartSelector
          :parts="availableParts.arms"
          position="left"
          @partSelected="(part) => (selectedRobot.leftArm = part)"
        />
        <PartSelector
          :parts="availableParts.torsos"
          position="center"
          @partSelected="(part) => (selectedRobot.torso = part)"
        />
        <PartSelector
          :parts="availableParts.arms"
          position="right"
          @partSelected="(part) => (selectedRobot.rightArm = part)"
        />
      </div>
      <div class="bottom-row">
        <PartSelector
          :parts="availableParts.bases"
          position="bottom"
          @partSelected="(part) => (selectedRobot.base = part)"
        />
      </div>
    </div>
    <div>
      <h1>Cart</h1>
      <table>
        <thead>
          <tr>
            <th>Robot</th>
            <th class="cost">Cost</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(robot, index) in cart" :key="index">
            <td>{{ robot.head.title }}</td>
            <td class="cost">{{ toCurrency(robot.cost) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import parts from '../data/parts'
import { toCurrency } from '../shared/formatters'
import PartSelector from './PartSelector.vue'
import CollapsibleSection from '../shared/CollapsibleSection.vue'

const getNextValidIndex = (index, length) => {
  const incrementedIndex = index + 1
  return incrementedIndex > length - 1 ? 0 : incrementedIndex
}

const getPreviousValidIndex = (index, length) => {
  const decrementIndex = index - 1
  return decrementIndex < 0 ? length - 1 : decrementIndex
}

const availableParts = parts
const selectedHeadIndex = ref(0)
const selectedLeftArmIndex = ref(0)
const selectedRightArmIndex = ref(0)
const selectedTorsoIndex = ref(0)
const selectedBaseIndex = ref(0)
const cart = ref([])

const saleBorderClass = computed(() => ({
  border: selectedRobot.head.onSale ? 'sale-border' : ''
}))

const headBorderColor = computed(() => (selectedRobot.value.head.onSale ? 'red' : '#aaa'))

onMounted(() => {
  console.log('onMount executed')
})

const selectedRobot = computed(() => ({
  head: availableParts.heads[selectedHeadIndex.value],
  leftArm: availableParts.arms[selectedLeftArmIndex.value],
  torso: availableParts.torsos[selectedTorsoIndex.value],
  rightArm: availableParts.arms[selectedRightArmIndex.value],
  base: availableParts.bases[selectedBaseIndex.value]
}))

const addToCart = () => {
  const robot = selectedRobot.value
  const cost =
    robot.head.cost + robot.leftArm.cost + robot.torso.cost + robot.rightArm.cost + robot.base.cost
  cart.value.push({ ...robot, cost })
  console.log(cart.length)
}
// #region Part Selector Method

const selectNextHead = () => {
  selectedHeadIndex.value = getNextValidIndex(selectedHeadIndex.value, availableParts.heads.length)
}
const selectPreviousHead = () => {
  selectedHeadIndex.value = getPreviousValidIndex(
    selectedHeadIndex.value,
    availableParts.heads.length
  )
}
const selectNextLeftArm = () => {
  selectedHeadIndex.value = getNextValidIndex(selectedHeadIndex.value, availableParts.arms.length)
}
const selectPreviousLeftArm = () => {
  selectedHeadIndex.value = getPreviousValidIndex(
    selectedHeadIndex.value,
    availableParts.arms.length
  )
}
const selectNextRightArm = () => {
  selectedHeadIndex.value = getNextValidIndex(selectedHeadIndex.value, availableParts.arms.length)
}
const selectPreviousRightArm = () => {
  selectedHeadIndex.value = getPreviousValidIndex(
    selectedHeadIndex.value,
    availableParts.arms.length
  )
}
const selectNextTorso = () => {
  selectedHeadIndex.value = getNextValidIndex(selectedHeadIndex.value, availableParts.torsos.length)
}
const selectPreviousTorso = () => {
  selectedHeadIndex.value = getPreviousValidIndex(
    selectedHeadIndex.value,
    availableParts.torsos.length
  )
}
const selectNextBase = () => {
  selectedHeadIndex.value = getNextValidIndex(selectedHeadIndex.value, availableParts.bases.length)
}

const selectPreviousBase = () => {
  selectedHeadIndex.value = getPreviousValidIndex(
    selectedHeadIndex.value,
    availableParts.bases.length
  )
}
// #endregion
</script>

<style lang="scss" scoped>
.part {
  position: relative;
  width: 200px;
  height: 200px;
  border: 3px solid #aaa;
}

.top.part {
  border: 3px solid v-bind(headBorderColor);
}

.part {
  img {
    width: 200px;
  }
}

.top-row {
  display: flex;
  justify-content: space-around;
}

.middle-row {
  display: flex;
  justify-content: center;
}

.bottom-row {
  display: flex;
  justify-content: space-around;
  border-top: none;
}

.top {
  border-bottom: none;
}

.left {
  border-right: none;
}

.right {
  border-left: none;
}

.left img {
  transform: rotate(-90deg);
}

.right img {
  transform: rotate(90deg);
}

.bottom {
  border-top: none;
}

.prev-selector {
  position: absolute;
  z-index: 1;
  top: -3px;
  left: -28px;
  width: 25px;
  height: 206px;
}

.next-selector {
  position: absolute;
  z-index: 1;
  top: -3px;
  right: -28px;
  width: 25px;
  height: 206px;
}

.center .prev-selector,
.center .next-selector {
  opacity: 0.8;
}

.left .prev-selector {
  top: -28px;
  left: -3px;
  width: 179px;
  height: 25px;
}

.left .next-selector {
  top: auto;
  bottom: -28px;
  left: -3px;
  width: 179px;
  height: 25px;
}

.right .prev-selector {
  top: -28px;
  left: 24px;
  width: 179px;
  height: 25px;
}

.right .next-selector {
  top: auto;
  bottom: -28px;
  left: 24px;
  width: 179px;
  height: 25px;
}

.right .next-selector {
  right: -3px;
}

.robot-name {
  position: absolute;
  top: -25px;
  text-align: center;
  width: 100%;
}

.sale {
  color: red;
}

.content {
  position: relative;
}

.preview {
  position: absolute;
  top: -20px;
  right: 0;
  width: 310px;
  height: 310px;
  padding: 5px;
}

.preview-content {
  border: 1px solid #999;
}

.preview img {
  width: 70px;
  height: 70px;
}

.rotate-right {
  transform: rotate(90deg);
}

.rotate-left {
  transform: rotate(-90deg);
}

.add-to-cart {
  position: absolute;
  width: 310px;
  padding: 3px;
  font-size: 16px;
}

td,
th {
  text-align: left;
  padding: 5px;
  padding-right: 20px;
}

.cost {
  text-align: right;
}
</style>
