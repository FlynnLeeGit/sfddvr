const ENV = process.env.NODE_ENV
console.log(ENV)
module.exports = {
  IMG_SERVER: {
    development: 'http://ocefx1x5d.bkt.clouddn.com',
    staging: 'https://dn-st.baogaoyezhu.com',
    production: 'https://dn-st.baogaoyezhu.com'
  }[ENV],
  base: '/virtual_reality/'
}
