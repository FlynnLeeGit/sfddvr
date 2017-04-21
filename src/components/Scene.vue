<template>
  <a-scene @mousedown='toggleFly()'>
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

    <a-entity :rotation='getLinkRotation(link.y)'
              v-for='link in currentRoom.links'
              :key='link.room'>
      <a-plane src='#city-thumb'
               position='0 0 -5'
               @click="goNextRoom(link.room)"
               @mouseenter='isHover=true'
               @mouseleave='isHover=false'>

        <a-animation begin='mouseenter'
                     end='mouseleave'
                     attribute='position'
                     direction='alternate'
                     to='0 0.1 -5'
                     repeat='indefinite'
                     dur='500'></a-animation>
      </a-plane>
    </a-entity>

    <a-camera id='room-camera'
              user-height='0'
              wasd-controls='enabled:false;'>
      <a-cursor :color="isHover?'green':'white'"></a-cursor>
      <a-animation v-if='isFly'
                   attribute='rotation'
                   to='0 -360 0'
                   repeat='indefinite'
                   dur='100000'
                   easing='linear'></a-animation>
      <a-animation @animationend='changingEnd()'
                   v-if='isChanging'
                   attribute='zoom'
                   from='1'
                   to='.1'
                   dur='300'
                   easing='linear'
                   direction='alternate'
                   repeat='1'></a-animation>
    </a-camera>

    <a-light type="ambient"></a-light>

    <div class="scene-loader"
         v-if='isLoading'>
      <span class="scene-loader__txt">场景加载中...</span>
    </div>
  </a-scene>
</template>

<style src='./Scene.css'></style>

<script>
import { assetsLoad } from '@/plugins/utils'

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
  props: {
    sceneData: {
      type: Object,
      default: () => ({
        rooms: [
          { walls: [], links: [] }
        ]
      })
    }
  },
  data () {
    return {
      size: BOX_SIZE,
      isFly: true,
      isChanging: false,
      isHover: false,
      roomsMap: {},
      currentRoom: {},
      isLoading: false
    }
  },
  created () {
    this.initScene(this.sceneData)
  },
  methods: {
    initScene (scene) {
      scene._roomsMap = {}
      scene.rooms.forEach(r => {
        scene._roomsMap[r.id] = r
      })
      this.roomsMap = scene._roomsMap

      const _currentRoom = scene.rooms[0]
      this.isLoading = true
      assetsLoad(_currentRoom.walls.map(w => w.src))
        .then(() => {
          this.currentRoom = _currentRoom
          setTimeout(() => {
            this.isLoading = false
          }, 100)
        })
    },
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
  },
  watch: {
    sceneData (newScene) {
      this.initScene(newScene)
    }
  }
}
</script>
