export default {
  name: "users",
  title: "使用者",
  type: "document",
  initialValue: {
    progress: 0,
  },
  fields: [
    {
      name: "name",
      title: "名稱",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    // {
    //   name: 'slug',
    //   title: 'Slug',
    //   type: 'slug',
    //   options: {
    //     source: 'name',
    //     maxLength: 96,
    //   },
    // },
    {
      name: "image",
      title: "頭貼",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      title: "權限",
      name: "auth",
      type: "string",
      options: {
        list: [
          { title: "管理", value: "manage" },
          { title: "普通", value: "normal" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "progress",
      title: "經驗值",
      type: "number",
    },

    // {
    //   name: 'bio',
    //   title: 'Bio',
    //   type: 'array',
    //   of: [
    //     {
    //       title: 'Block',
    //       type: 'block',
    //       styles: [{title: 'Normal', value: 'normal'}],
    //       lists: [],
    //     },
    //   ],
    // },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "auth",
      media: "image",
    },
  },
};
