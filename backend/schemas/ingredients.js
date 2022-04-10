export default {
  name: "ingredients",
  title: "食材",
  type: "document",
  //liveEdit: true,
  fields: [
    {
      name: "thumbnail",
      title: "食材圖片",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "title",
      title: "食材名稱",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "種類",
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "全榖雜糧類", value: "全榖雜糧類" },
          { title: "蔬菜類", value: "蔬菜類" },
          { title: "豆魚蛋肉類", value: "豆魚蛋肉類" },
          { title: "乳品類", value: "乳品類" },
          { title: "水果類", value: "水果類" },
          { title: "油脂與堅果種子類", value: "油脂與堅果種子類" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: "unit",
      title: "食材單位",
      type: "reference",
      to: { type: "unit" },
    },
  ],
};
