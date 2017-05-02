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
  methods: {
    initAnchor () {
      const anchor = new Anchor({
        content: this.content,
        thumb: '/virtual_reality/static/thumb.jpg'
      })
      anchor.render()
        .then(dataUrl => {
          this.$refs.anchor.setAttribute('src', dataUrl)
        })
        .catch(e => {
          console.error(e) // eslint-disable-line
        })
    }
  },
  mounted () {
    this.initAnchor()
  }
}
</script>
