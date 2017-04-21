<template>
  <scene :scene-data='scene'
         v-if='showVR' />
  <span v-else>路径错误</span>
</template>
<script>
import Scene from './components/Scene'
import axios from '@/plugins/axios'

import { produceSceneFromInspiration } from '@/plugins/utils'

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
    // android chrome can not get $route.params so here use $route.fullpath
    const id = +this.$route.fullPath.match(/\d+/)[0]
    const url = `/_fapi/inspirations/${id}/vr`

    switch (this.$route.name) {
      case 'inspiration.vr':
        axios.get(url)
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
