<template>
  <scene :scene-data='scene'
         v-if='showVR' />
  <span v-else>路径错误</span>
</template>
<script>
import axios from '@/plugins/axios'
import Scene from '@/components/Scene'
import shareScene from './shareScene'

export default {
  name: 'App',
  components: {
    Scene
  },
  data () {
    return {
      showVR: true,
      scene: [{
        imgs: {}
      }]
    }
  },
  created () {
    const routeName = this.$route.name
    if (!routeName) {
      this.showVR = false
    }
    const getId = () => +this.$route.fullPath.match(/\d+/)[0]
    // android chrome can not get $route.params so here use $route.fullpath
    let url
    switch (routeName) {
      case 'inspiration.vr':
        url = `/_fapi/inspirations/${getId()}/vr`
        axios.get(url)
          .then(({ data }) => {
            this.scene = [data]
          })
        break
      case 'scene.vr':
        url = `/_fapi/planschemes/${getId()}/space`
        axios.get(url)
          .then(({ data }) => {
            this.scene = data
          })
        break
      case 'share.vr':
        this.scene = shareScene
        break
      default:
        break
    }
  }
}
</script>
