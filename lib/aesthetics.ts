export interface AestheticCategory {
  slug: string;
  label: string;
}

export const aestheticCategories: AestheticCategory[] = [
  { slug: "clean-girl", label: "Clean girl" },
  { slug: "y2k", label: "Y2K" },
  { slug: "minimalist", label: "Minimalist" },
  { slug: "summer", label: "Summer" },
  { slug: "date", label: "Date" },
  { slug: "street", label: "Street" },
  { slug: "workwear", label: "Workwear" },
  { slug: "travel", label: "Travel" },
  { slug: "monsoon", label: "Monsoon" },
  { slug: "evening", label: "Evening" }
];

export function getAestheticLabel(slug?: string) {
  return aestheticCategories.find((category) => category.slug === slug)?.label;
}
