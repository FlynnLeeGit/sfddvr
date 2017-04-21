<template>
  <scene v-if='showVR'
         :scene-data='scene' />
  <span v-else>错误的访问路径</span>
</template>
<script>
import Scene from './components/Scene'
import axios from '@/plugins/axios'
import { imgFilter } from '@/plugins/filters'

const directionMap = {
  image_back: 'back',
  image_down: 'bottom',
  image_fornt: 'front',
  image_left: 'left',
  image_right: 'right',
  image_up: 'top'
}

const produceSceneFromInspiration = inspiartion => {
  const scene = {
    id: inspiartion.id,
    name: inspiartion.title,
    rooms: [{
      id: inspiartion.id,
      name: inspiartion.title,
      walls: [],
      links: []
    }]
  }
  Object.keys(inspiartion.imgs).forEach((k, idx) => {
    scene.rooms[0].walls.push({
      id: `${inspiartion.id}_${idx}`,
      direction: directionMap[k],
      src: imgFilter(inspiartion.imgs[k])
    })
  })

  return scene
}

export default {
  name: 'App',
  components: {
    Scene
  },
  data () {
    return {
      showVR: true,
      scene: {
        rooms: [
          { walls: [], links: [] }
        ]
      }
    }
  },
  created () {
    const routeName = this.$route.name
    if (!routeName) {
      this.showVR = false
    }

    switch (this.$route.name) {
      case 'inspiration.vr':
        axios.get(`/_fapi/inspirations/${this.$route.params.id}/vr`)
          .then(({ data }) => {
            this.scene = produceSceneFromInspiration(data)
          })
        break
      default:
        break
    }
  }
}
</script>
