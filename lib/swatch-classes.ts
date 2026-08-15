const swatches: Record<string, string> = {
  "#050505": "bg-[#050505]",
  "#082A20": "bg-[#082A20]",
  "#0F0F0F": "bg-[#0F0F0F]",
  "#0F4C3A": "bg-[#0F4C3A]",
  "#111111": "bg-[#111111]",
  "#171717": "bg-[#171717]",
  "#1B2734": "bg-[#1B2734]",
  "#252525": "bg-[#252525]",
  "#2D2A25": "bg-[#2D2A25]",
  "#4A2D23": "bg-[#4A2D23]",
  "#546045": "bg-[#546045]",
  "#6A655D": "bg-[#6A655D]",
  "#6B4735": "bg-[#6B4735]",
  "#6D7178": "bg-[#6D7178]",
  "#866F58": "bg-[#866F58]",
  "#8C8C84": "bg-[#8C8C84]",
  "#AAB0B7": "bg-[#AAB0B7]",
  "#B59D69": "bg-[#B59D69]",
  "#B9AA97": "bg-[#B9AA97]",
  "#C8B9A8": "bg-[#C8B9A8]",
  "#D8D2C8": "bg-[#D8D2C8]",
  "#D9C7B7": "bg-[#D9C7B7]",
  "#E3D5C7": "bg-[#E3D5C7]",
  "#E8E2D8": "bg-[#E8E2D8]",
  "#EEE6D8": "bg-[#EEE6D8]",
  "#EFE7DA": "bg-[#EFE7DA]",
  "#F7F5EF": "bg-[#F7F5EF]",
  "#FFFFFF": "bg-white"
};

export function swatchClass(color: string) {
  return swatches[color] ?? "bg-white/20";
}
