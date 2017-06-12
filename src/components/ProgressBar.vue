<template>
  <div class="ProgressBar">
    <div class="ProgressBar__wrap -left">
      <div class="ProgressBar__circle -left"
           :active='active && isMobile'></div>
    </div>
    <div class="ProgressBar__wrap -right">
      <div class="ProgressBar__circle -right"
           :active='active && isMobile'></div>
    </div>
    <div class="ProgressBar__cursor">
      <div class="ProgressBar__cursor-ray"
           :active='active && !isMobile'>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>


<style src='./ProgressBar.css'></style>

