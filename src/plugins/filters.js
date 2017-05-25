import { IMG_SERVERS } from '../../localConfig.js'

export const imgViewFilter = (fname, viewOpts, env = process.env.NODE_ENV) => {
  // webp 支持
  if (window.Modernizr.webp) {
    viewOpts.format = 'webp'
  }
  const opts = []
  Object.keys(viewOpts).forEach(k => {
    opts.push(`${k}/${viewOpts[k]}`)
  })
  const IMG_SERVER = IMG_SERVERS[env]
  return `${IMG_SERVER}/${fname}?imageView2/2/${opts.join('/')}`
}
