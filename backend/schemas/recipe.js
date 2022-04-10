export default {
  name: "recipes",
  title: "食譜投稿",
  type: "document",
  fields: [
    {
      name: "thumbnail",
      title: "食譜封面",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "食譜標題",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "cookTime",
      title: "料理時間（分鐘）",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "serving",
      title: "人份",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "rating",
      title: "星級",
      type: "number",
      validation: (Rule) => Rule.required().min(0.5),
    },
    {
      name: "likes",
      title: "讚",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    // {
    //   name: "slug",
    //   title: "Slug",
    //   type: "slug",
    //   options: {
    //     source: "title",
    //     maxLength: 96,
    //   },
    // },
    {
      name: "publishedAt",
      title: "發佈時間",
      type: "datetime",
    },
    {
      name: "user",
      title: "作者",
      type: "reference",
      to: { type: "users" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "ingredientRecommendTags",
      title: "核心食材",
      type: "array",
      of: [{ type: "reference", to: { type: "ingredients" } }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "ingredientTags",
      title: "食材",
      type: "array",
      of: [{ type: "reference", to: { type: "ingredients" } }],
      options: {
        layout: "tags",
      },
    },

    {
      name: "ingredientsInfo",
      title: "食材詳細資訊",
      type: "array",
      of: [
        {
          type: "ingredientInfo",
          // title: '食材資訊',
          // name: 'ingredientInfo',
        },
      ],
      options: {
        layout: "tags",
      },
    },

    {
      name: "steps",
      title: "步驟",
      type: "array",
      of: [{ type: "step", to: { type: "step" } }],
      validation: (Rule) => Rule.unique(), // only want unique items in an array
      options: {
        layout: "tags",
      },
    },

    // {
    //   name: "body",
    //   title: "回饋",
    //   type: "blockContent",
    // },
  ],
  // 外觀
  preview: {
    select: {
      title: "title",
      author: "user.name",
      media: "thumbnail",
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `作者： ${author}`,
      });
    },
  },
  // 排序
  orderings: [
    {
      title: "最新",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "最舊",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      title: "讚數(由高至低)",
      name: "likes",
      by: [{ field: "likes", direction: "desc" }],
    },
  ],
  // 初值
  initialValue: {
    likes: 0,
    serving: 1,
    cookTime: 10,
  },
};
