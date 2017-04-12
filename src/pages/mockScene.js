export default {
  id: 1,
  name: '场景1',
  rooms: [
    {
      id: 1,
      name: '空间1',
      links: [
        { id: 2, room: 2, y: -40 },
        { id: 2, room: 2, y: -60 },
        { id: 2, room: 2, y: -100 }
      ],
      walls: [
        { id: 1, direction: 'left', src: '#left' },
        { id: 2, direction: 'right', src: '#right' },
        { id: 3, direction: 'front', src: '#front' },
        { id: 4, direction: 'back', src: '#back' },
        { id: 5, direction: 'top', src: '#top' },
        { id: 6, direction: 'bottom', src: '#bottom' }
      ]
    },
    {
      id: 2,
      name: '空间2',
      links: [{ id: 1, room: 1, y: 0 }, { id: 1, room: 1, y: 180 }],
      walls: [
        { id: 1, direction: 'left', src: '#left-vr' },
        { id: 2, direction: 'right', src: '#right-vr' },
        { id: 3, direction: 'front', src: '#front-vr' },
        { id: 4, direction: 'back', src: '#back-vr' },
        { id: 5, direction: 'top', src: '#top-vr' },
        { id: 6, direction: 'bottom', src: '#bottom-vr' }
      ]
    }
  ]
}
