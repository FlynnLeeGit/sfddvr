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
    fontSize = 30,
    fontFamily = 'Georgia',
    color = '#fff',
    baseline = 'top',
    content = 'text',
    textAlign = 'center',
    thumb = ''
  }) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    document.body.appendChild(this.canvas)
    this.opts = {
      fontSize,
      fontFamily,
      color,
      baseline,
      content,
      textAlign,
      thumb
    }
    this.setCanvasSize(256, 256)
  }
  setCanvasSize (width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
  setBgImg () {
    return new Promise((resolve, reject) => {
      const bg = new Image()
      bg.src = this.opts.thumb
      bg.onload = () => {
        this.ctx.drawImage(bg, 0, 0, 256, 256)
        resolve()
      }
      bg.onerror = reject
    })
  }
  setOverlay () {
    this.ctx.fillStyle = 'rgba(0,0,0,.3)'
    this.ctx.fillRect(0, 0, 256, 256)
  }
  setText () {
    this.ctx.font = `${this.opts.fontSize}px ${this.opts.fontFamily}`
    this.ctx.fillStyle = this.opts.color
    this.ctx.textBaseline = this.opts.baseline
    this.ctx.textAlign = this.opts.textAlign
    const content = this.opts.content
    this.ctx.fillText(content, 256 / 2, 20)
  }
  render () {
    return this.setBgImg()
      .then(() => {
        this.setOverlay()
        this.setText()
        return this.canvas.toDataURL('image/png')
      })
  }
}
