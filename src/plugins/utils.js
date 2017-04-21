import { imgFilter } from '@/plugins/filters'
import axios from '@/plugins/axios'

const DIRECTION_MAP = {
  image_back: 'back',
  image_down: 'bottom',
  image_fornt: 'front',
  image_left: 'left',
  image_right: 'right',
  image_up: 'top'
}

export const produceSceneFromInspiration = inspiartion => {
  const scene = {
    id: inspiartion.id,
    name: inspiartion.title,
    rooms: [
      { id: inspiartion.id, name: inspiartion.title, walls: [], links: [] }
    ]
  }

  Object.keys(inspiartion.imgs).forEach((k, idx) => {
    const imgSrc = imgFilter(inspiartion.imgs[k])
    scene.rooms[0].walls.push({
      id: `${inspiartion.id}_${idx}`,
      direction: DIRECTION_MAP[k],
      src: imgSrc
    })
  })
  return scene
}

export const assetsLoad = assets => {
  const assetsPromise = assets.map(src => {
    return axios.get(src)
  })
  return Promise.all(assetsPromise)
}
