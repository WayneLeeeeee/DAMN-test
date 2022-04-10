export default {
  title: '步驟',
  name: 'step',
  type: 'object',
  fields: [
    {
      name: 'imageURL',
      title: '步驟圖片',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    { name: 'content', type: 'string', title: '步驟內容' },
  ],
}
