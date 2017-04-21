import { IMG_SERVER } from '../../config.js'
export const imgFilter = (fname, suffix = '') =>
  `${IMG_SERVER}/${fname}${suffix && '_' + suffix}`
