export default {
  title: '食材資訊',
  name: 'ingredientInfo',
  type: 'object',
  fields: [
    // {
    //   name: 'imageURL',
    //   title: '步驟圖片',
    //   type: 'image',
    //   options: {
    //     hotspot: true,
    //   },
    // },

    {
      name: 'ingredientTags',
      title: '食材',
      type: 'reference',
      to: { type: 'ingredients' },
    },
    { name: 'count', type: 'number', title: '數量' },
    {
      name: 'unit',
      title: '食材單位',
      type: 'reference',
      to: { type: 'unit' },
    },
  ],
  preview: {
    select: {
      title: 'ingredientTags.title',
      subtitle: 'count',
      unit: 'unit.name',
    },
    prepare(selection) {
      const { title, unit, subtitle } = selection
      return {
        title: title,
        subtitle: `${subtitle} ${unit}`,
      }
    },
  },
}
