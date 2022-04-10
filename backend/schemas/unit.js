export default {
  title: "單位",
  name: "unit",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
      title: "單位",
      validation: (Rule) => Rule.required(),
    },
  ],
};
