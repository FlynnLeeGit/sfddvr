<template>
  <a-entity position='0 0 -4'>
    <a-entity :text-geometry='fontVal'
              :position='fontPosition'
              material='color:#fff;'>
    </a-entity>
    <a-plane @click='anchorClick(sid)'
             @mouseenter='anchorMouseEnter(sid)'
             @mouseleave='anchorMouseLeave(sid)'
             position='0 0 0.2'
             :width='fontBoxWidth * 1.4'
             :height='fontBoxHeight * 1.8'
             material="color:#000;opacity:0.1;">
    </a-plane>
  </a-entity>
</template>
<script>

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    sid: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      fontSize: 0.15
    }
  },
  computed: {
    fontVal () {
      return `value:${this.content};font:#zwfont;size:${this.fontSize};height:0.1;`
    },
    fontBoxWidth () {
      return (this.content.length * this.fontSize * 1.4)
    },
    fontBoxHeight () {
      return this.fontSize * 1.4
    },
    fontPosition () {
      const offsetX = (this.fontBoxWidth / 2).toFixed(1)
      return `-${offsetX} -${this.fontSize / 2} 0`
    }
  },
  methods: {
    anchorClick () {
      this.$emit('click')
    },
    anchorMouseEnter () {
      this.$emit('mouseenter')
    },
    anchorMouseLeave () {
      this.$emit('mouseleave')
    }
  }
}
</script>
