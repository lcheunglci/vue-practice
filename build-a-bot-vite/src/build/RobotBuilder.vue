<template>
  <div>
    <div>
      <div class="content">
        <button class="add-to-cart" @click="addToCart()">Add to Cart</button>
        <div class="top-row">
          <div class="top part">
            <div class="robot-name">
              {{ selectedRobot.head.title }}
              <span v-if="selectedRobot.head.onSale" class="sale">Sale!</span>
            </div>
            <img :src="selectedRobot.head.imageUrl" alt="head" />
            <button @click="selectPreviousHead()" class="prev-selector">&#9668;</button>
            <button @click="selectNextHead()" class="next-selector">&#9658;</button>
          </div>
        </div>
      </div>
      <div class="middle-row">
        <div class="left part">
          <img :src="selectedRobot.leftArm.imageUrl" alt="left arm" />
          <button @click="selectPreviousLeftArm()" class="prev-selector">&#9650;</button>
          <button @click="selectNextLeftArm()" class="next-selector">&#9660;</button>
        </div>
        <div class="center part">
          <img :src="selectedRobot.torso.imageUrl" alt="torso" />
          <button @click="selectPreviousTorso()" class="prev-selector">&#9668;</button>
          <button @click="selectNextTorso()" class="next-selector">&#9658;</button>
        </div>
        <div class="right part">
          <img :src="selectedRobot.rightArm.imageUrl" alt="right arm" />
          <button @click="selectPreviousRightArm()" class="prev-selector">&#9650;</button>
          <button @click="selectNextRightArm()" class="next-selector">&#9660;</button>
        </div>
      </div>
      <div class="bottom-row">
        <div class="bottom part">
          <img :src="selectedRobot.base.imageUrl" alt="base" />
          <button @click="selectPreviousBase()" class="prev-selector">&#9668;</button>
          <button @click="selectNextBase()" class="next-selector">&#9658;</button>
        </div>
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

<script>
import { computed } from 'vue'
import parts from '../data/parts'
import { toCurrency } from '../shared/formatters'

export default {
  name: 'RobotBuilder',
  setup() {
    const getNextValidIndex = (index, length) => {
      const incrementedIndex = index + 1
      return incrementedIndex > length - 1 ? 0 : incrementedIndex
    }

    const getPreviousValidIndex = (index, length) => {
      const decrementIndex = index - 1
      return decrementIndex < 0 ? length - 1 : decrementIndex
    }

    let availableParts = parts
    let selectedHeadIndex = 0
    let selectedLeftArmIndex = 0
    let selectedRightArmIndex = 0
    let selectedTorsoIndex = 0
    let selectedBaseIndex = 0
    let cart = []

    const selectedRobot = computed(() => ({
      head: availableParts.heads[selectedHeadIndex],
      leftArm: availableParts.arms[selectedLeftArmIndex],
      torso: availableParts.torsos[selectedTorsoIndex],
      rightArm: availableParts.arms[selectedRightArmIndex],
      base: availableParts.bases[selectedBaseIndex]
    }))

    const addToCart = () => {
      const robot = selectedRobot
      const cost =
        robot.head.cost +
        robot.leftArm.cost +
        robot.torso.cost +
        robot.rightArm.cost +
        robot.base.cost
      cart.push({ ...robot, cost })
      console.log(cart.length)
    }
    // #region Part Selector Method

    const selectNextHead = () => {
      selectedHeadIndex = getNextValidIndex(selectedHeadIndex, availableParts.heads.length)
    }
    const selectPreviousHead = () => {
      selectedHeadIndex = getPreviousValidIndex(selectedHeadIndex, availableParts.heads.length)
    }
    const selectNextLeftArm = () => {
      selectedHeadIndex = getNextValidIndex(selectedHeadIndex, availableParts.arms.length)
    }
    const selectPreviousLeftArm = () => {
      selectedHeadIndex = getPreviousValidIndex(selectedHeadIndex, availableParts.arms.length)
    }
    const selectNextRightArm = () => {
      selectedHeadIndex = getNextValidIndex(selectedHeadIndex, availableParts.arms.length)
    }
    const selectPreviousRightArm = () => {
      selectedHeadIndex = getPreviousValidIndex(selectedHeadIndex, availableParts.arms.length)
    }
    const selectNextTorso = () => {
      selectedHeadIndex = getNextValidIndex(selectedHeadIndex, availableParts.torsos.length)
    }
    const selectPreviousTorso = () => {
      selectedHeadIndex = getPreviousValidIndex(selectedHeadIndex, availableParts.torsos.length)
    }
    const selectNextBase = () => {
      selectedHeadIndex = getNextValidIndex(selectedHeadIndex, availableParts.bases.length)
    }

    const selectPreviousBase = () => {
      selectedHeadIndex = getPreviousValidIndex(selectedHeadIndex, availableParts.bases.length)
    }
    // #endregion

    return {
      availableParts,
      selectedHeadIndex,
      selectedLeftArmIndex,
      selectedRightArmIndex,
      selectedTorsoIndex,
      selectedBaseIndex,
      cart,
      selectedRobot,
      toCurrency,
      addToCart,
      selectNextHead,
      selectPreviousHead,
      selectNextLeftArm,
      selectPreviousLeftArm,
      selectNextRightArm,
      selectPreviousRightArm,
      selectNextTorso,
      selectPreviousTorso,
      selectNextBase,
      selectPreviousBase
    }
  },
    
}
</script>

<style>
.part {
  position: relative;
  width: 200px;
  height: 200px;
  border: 3px solid #aaa;
}

.part img {
  width: 200px;
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

.add-to-cart {
  position: absolute;
  right: 30px;
  width: 220px;
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
