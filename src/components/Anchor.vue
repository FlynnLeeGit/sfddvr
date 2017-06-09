<template>
  <a-entity position='0 0 -4'>
    <a-entity :text-geometry='fontVal'
              :position='fontPosition'>
    </a-entity>
    <a-plane :width='planeWidth'
             :height='planeHeight'
             material='visible:false'>
    </a-plane>
    <!--<a-plane src='#door'
             color='#000'
             width='0.2'
             height='0.2'
             rotation='0 0 0'>
      <a-animation attribute='position'
                   direction='alternate'
                   from='0 -0.3 0'
                   to='0 -0.3 -0.5'
                   repeat='indefinite'
                   dur='1000'>
      </a-animation>
    </a-plane>-->
  </a-entity>
</template>
<script>

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fontSize: 0.18
    }
  },
  computed: {
    fontVal () {
      return `value:${this.content};font:#zwfont;size:${this.fontSize};height:0.3;`
    },
    planeWidth () {
      return (this.content.length * this.fontSize * 1.4)
    },
    planeHeight () {
      return this.fontSize * 1.4
    },
    fontPosition () {
      const offsetX = (this.planeWidth / 2).toFixed(1)
      return `-${offsetX} -${this.fontSize / 2} 0`
    }
  }
}
</script>
