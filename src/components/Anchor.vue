<template>
  <a-plane ref='anchor'
           position='0 0 -5'>
    <slot></slot>
  </a-plane>
</template>
<script>
import { Anchor } from '@/plugins/utils'
import { imgFilter } from '@/plugins/filters'
export default {
  props: {
    fname: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataUrl: '',
      anchor: null
    }
  },
  methods: {
    initAnchor () {
      const anchor = new Anchor({
        content: this.content,
        thumb: imgFilter(this.fname, 'case380')
      })
      anchor.render()
        .then(dataUrl => {
          this.dataUrl = dataUrl
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
