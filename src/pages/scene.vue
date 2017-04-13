<template>
  <a-scene @mousedown='toggleFly()'>
    <a-assets>
      <img src="../assets/thumb-city.jpg"
           id="city-thumb">
      <img id='left'
           src='../assets/vr2/left.jpg'>
      <img id='right'
           src='../assets/vr2/right.jpg'>
      <img id='front'
           src='../assets/vr2/front.jpg'>
      <img id='back'
           src='../assets/vr2/back.jpg'>
      <img id='top'
           src='../assets/vr2/top.jpg'>
      <img id='bottom'
           src='../assets/vr2/bottom.jpg'>

      <img id='left-vr'
           src='../assets/vr3/vr3left.jpg'>
      <img id='right-vr'
           src='../assets/vr3/vr3right.jpg'>
      <img id='front-vr'
           src='../assets/vr3/vr3front.jpg'>
      <img id='back-vr'
           src='../assets/vr3/vr3back.jpg'>
      <img id='top-vr'
           src='../assets/vr3/vr3top.jpg'>
      <img id='bottom-vr'
           src='../assets/vr3/vr3bottom.jpg'>
    </a-assets>

    <!--空间 整体y偏转-90度让图片与场景强名称一致-->
    <a-entity rotation='0 -90 0'>
      <a-plane v-for='w in currentRoom.walls'
             :key='w.id'
             :id="getWallId(currentRoom,w)"
             :src='w.src'
             :width='size'
             :height='size'
             :position="getPosition(w.direction)"
             :rotation="getRotation(w.direction)">
      </a-plane>
    </a-entity>

    <a-entity :rotation='getLinkRotation(link.y)' v-for='link in currentRoom.links' :key='link.room'>
       <a-plane src='#city-thumb' position='0 0 -5' @click="goNextRoom(link.room)" @mouseenter='isHover=true' @mouseleave='isHover=false'>

        <a-animation begin='mouseenter' end='mouseleave' attribute='position'
          direction='alternate' to='0 0.1 -5' repeat='indefinite'
          dur='500'></a-animation>
      </a-plane>
    </a-entity>


    <a-camera id='room-camera'
              user-height='0'
              wasd-controls='enabled:false;'>
      <a-cursor :color="isHover?'green':'white'"></a-cursor>
      <a-animation v-if='isFly' attribute='rotation' to='0 -360 0' repeat='indefinite' dur='50000' easing='linear'></a-animation>
      <a-animation @animationend='changingEnd()' v-if='isChanging' attribute='zoom' from='1' to='.1' dur='300' easing='linear' direction='alternate' repeat='1'></a-animation>
    </a-camera>



    <a-light type="ambient"></a-light>

  </a-scene>
</template>

<script>
import axios from '@/plugins/axios'
import mockScene from './mockScene'

// sky-box length
const BOX_SIZE = 5000

const ROTATION_MAP = {
  left: '0 -180 0',
  right: '0 0 0',
  front: '0 90 0',
  back: '0 -90 0',
  top: '90 90 0',
  bottom: '-90 90 0'
}

const POSITION_MAP = {
  left: `0 0 ${BOX_SIZE / 2}`,
  right: `0 0 -${BOX_SIZE / 2}`,
  front: `-${BOX_SIZE / 2} 0 0`,
  back: `${BOX_SIZE / 2} 0 0`,
  top: `0 ${BOX_SIZE / 2} 0`,
  bottom: `0 -${BOX_SIZE / 2} 0`
}

export default {
  data () {
    return {
      size: BOX_SIZE,
      isFly: true,
      isChanging: false,
      isHover: false,
      scene: {},
      roomsMap: {},
      currentRoom: {}
    }
  },
  created () {
    // const sceneId = this.$route.params.id
    // axios.get(`/_common/captcha/${sceneId}`)
    axios.get('/_common/captcha')
      .then(({ data }) => {
        mockScene._roomsMap = {}
        mockScene.rooms.forEach(r => {
          mockScene._roomsMap[r.id] = r
        })
        this.scene = mockScene
        this.currentRoom = mockScene.rooms[0]
        this.roomsMap = mockScene._roomsMap
      })
  },
  methods: {
    toggleFly () {
      if (this.isFly) {
        this.isFly = false
      }
    },
    getRotation (direction) {
      return ROTATION_MAP[direction]
    },
    getPosition (direction) {
      return POSITION_MAP[direction]
    },
    getWallId (room, wall) {
      return `room#${room.id}_${wall.direction}`
    },
    goNextRoom (roomId) {
      // this.currentRoom = roomId
      this.isChanging = true
      setTimeout(() => {
        this.currentRoom = this.roomsMap[roomId]
      }, 150)
    },
    changingEnd () {
      this.isChanging = false
    },
    getLinkRotation (y) {
      return `0 ${y} 0`
    }
  }
}
</script>


<style lang="postcss">




</style>
