import { IMG_SERVER } from '../../localConfig.js'
export const imgFilter = (fname, suffix = '') =>
  `${IMG_SERVER}/${fname}${suffix && '_' + suffix}`
