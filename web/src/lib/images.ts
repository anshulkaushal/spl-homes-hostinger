export const imageBlur =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10"><rect fill="#ece6da" width="16" height="10"/></svg>`,
  );

export const ratios = {
  hero: "aspect-[16/9] sm:aspect-[21/9]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  beforeAfter: "aspect-[4/3]",
} as const;
