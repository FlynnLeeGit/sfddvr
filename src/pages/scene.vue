<template>
  <a-scene>
    <a-assets>
      <img src="../assets/thumb-city.jpg"
           id="city-thumb">
    </a-assets>
    <!--墙体-->
    <a-entity :id="'room#'+room.id" :key='room.id' v-for='room in scene.rooms'>
      <a-plane :src='room.src' :id="'room#'+room.id+'_'+wall.position" :key='wall.id' v-for='wall in room.walls' width='14' height='14'></a-plane>
    </a-entity>

    <a-camera id='room-camera' user-height='0' wasd-controls='enabled:false;'>
      <a-cursor></a-cursor>
    </a-camera>

    <a-light type="ambient"></a-light>

  </a-scene>
</template>

<script>
import axios from '@/plugins/axios'
export default {
  data () {
    return {
      size: 14,
      scene: {
        rooms: []
      }
    }
  },
  created () {
    // const sceneId = this.$route.params.id
    // axios.get(`/_common/captcha/${sceneId}`)
    axios.get('/_common/captcha')
      .then(({ data }) => {
        this.scene = {
          id: 1,
          name: '场景1',
          rooms: [
            {
              id: 1,
              name: '空间1',
              walls: [
                { id: 1, position: 'left', src: '../assets/vr1/1.jpg', links: [] },
                { id: 2, position: 'back', src: '../assets/vr1/2.jpg', links: [] },
                { id: 3, position: 'right', src: '../assets/vr1/3.jpg', links: [] },
                { id: 4, position: 'front', src: '../assets/vr1/4.jpg', links: [] },
                { id: 5, position: 'top', src: '../assets/vr1/5.jpg', links: [] },
                { id: 6, position: 'bottom', src: '../assets/vr1/6.jpg', links: [] }
              ]
            }
          ]
        }
      })
  },
  methods: {
    getRotation (position) {
      console.log(position)
    }
  }
}
</script>


<style lang="postcss">




</style>
