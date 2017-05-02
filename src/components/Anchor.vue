<template>
  <a-plane ref='anchor'
           position='0 0 -5'>
    <slot></slot>
  </a-plane>
</template>
<script>
import { Anchor } from '@/plugins/utils'

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataUrl: ''
    }
  },
  methods: {
    initAnchor () {
      if (this.fname) {
        const anchor = new Anchor({
          content: this.content,
          thumb: '/virtual_reality/static/thumb.jpg'
        })
        anchor.render()
          .then(dataUrl => {
            this.dataUrl = dataUrl
            this.$refs.anchor.setAttribute('src', dataUrl)
          })
          .catch(e => {
            console.error(e) // eslint-disable-line
          })
      } else {
        console.error('空间图片加载失败') // eslint-disable-line
      }
    }
  },
  mounted () {
    this.initAnchor()
  }
}
</script>
