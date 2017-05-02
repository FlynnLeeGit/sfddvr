import axios from '@/plugins/axios'
// import {
//   imgFilter
// } from '@/plugins/filters'

export const assetsLoad = assets => {
  const assetsPromise = assets.map(src => {
    return axios.get(src)
  })
  return Promise.all(assetsPromise)
}

export class Anchor {
  constructor ({
    fontSize = 40,
    fontFamily = 'Georgia',
    color = '#fff',
    baseline = 'middle',
    content = 'text',
    textAlign = 'center',
    thumb = ''
  }) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.opts = {
      fontSize,
      fontFamily,
      color,
      baseline,
      content,
      textAlign,
      thumb
    }
    this.width = 256
    this.height = 256
    this.setCanvasSize(this.width, this.height)
  }
  setCanvasSize (width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
  setBgImg () {
    return new Promise((resolve, reject) => {
      const bg = new Image()
      bg.src = this.opts.thumb
      // canvas图片跨域
      bg.crossOrigin = 'anonymous'
      bg.onload = () => {
        this.ctx.drawImage(bg, 0, 0, this.width, this.height)
        resolve()
      }
      bg.onerror = reject
    })
  }
  setOverlay () {
    this.ctx.fillStyle = 'rgba(0,0,0,.3)'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }
  setText () {
    this.ctx.font = `${this.opts.fontSize}px ${this.opts.fontFamily}`
    this.ctx.fillStyle = this.opts.color
    this.ctx.textBaseline = this.opts.baseline
    this.ctx.textAlign = this.opts.textAlign
    const content = this.opts.content
    this.ctx.fillText('进入', this.width / 2, 80)
    this.ctx.fillText(content, this.width / 2, this.height / 2)
  }
  render () {
    return this.setBgImg().then(() => {
      this.setOverlay()
      this.setText()
      return this.canvas.toDataURL('image/png')
    })
  }
}
