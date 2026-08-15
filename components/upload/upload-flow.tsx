"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ImagePlus,
  type LucideIcon,
  Palette,
  Send,
  Sparkles,
  Tags,
  Upload
} from "lucide-react";
import { type ChangeEvent, type ReactNode, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextArea, TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";
import type { Occasion, Season } from "@/types";

const occasions: Occasion[] = ["Coffee", "Date Night", "Work", "Weekend", "Travel", "Evening"];
const seasons: Season[] = ["Summer", "Monsoon", "Autumn", "Winter", "All Season"];
const styles = [
  "Romantic minimal",
  "Quiet luxury",
  "Soft grunge",
  "Relaxed tailoring",
  "Utility minimal"
];
const paletteOptions = [
  "Black",
  "Ivory",
  "Forest",
  "Chocolate",
  "Indigo",
  "Olive",
  "Silver"
];

export function UploadFlow() {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("brown lace top, coffee look");
  const [occasion, setOccasion] = useState<Occasion>("Coffee");
  const [season, setSeason] = useState<Season>("Monsoon");
  const [style, setStyle] = useState(styles[0]);
  const [palette, setPalette] = useState<string[]>(["Chocolate", "Ivory"]);
  const [published, setPublished] = useState(false);

  const parsedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8),
    [tags]
  );

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const togglePalette = (color: string) => {
    setPalette((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color].slice(0, 4)
    );
  };

  const publish = () => {
    setPublished(true);
    window.setTimeout(() => setPublished(false), 2600);
  };

  return (
    <section className="px-4 pb-28 pt-5 mobile-safe-top">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <p className="text-xs font-medium uppercase text-bronze-soft">Create</p>
        <h1 className="mt-1 text-3xl font-semibold text-white">Upload outfit</h1>
      </motion.div>

      <div className="space-y-4">
        <motion.label
          whileTap={{ scale: 0.99 }}
          className="glass relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.8rem] border-dashed text-center"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Outfit preview"
              className="image-polish h-full w-full object-cover"
            />
          ) : (
            <div className="px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest to-bronze shadow-glow">
                <ImagePlus className="h-7 w-7 text-white" />
              </div>
              <p className="mt-4 text-base font-semibold text-white">
                Upload Image
              </p>
              <p className="mt-2 text-sm leading-5 text-white/50">
                Add a full outfit photo so people can save the look before they shop it.
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFile}
          />
        </motion.label>

        <Panel icon={Sparkles} title="Caption">
          <TextArea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Describe the look, the mood, and where you wore it."
          />
        </Panel>

        <Panel icon={Tags} title="Tags">
          <TextField
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="brown lace top, denim, coffee look"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {parsedTags.map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
        </Panel>

        <Panel icon={Upload} title="Occasion">
          <ChipGroup
            values={occasions}
            selected={occasion}
            onSelect={(value) => setOccasion(value as Occasion)}
          />
        </Panel>

        <Panel icon={Sparkles} title="Season">
          <ChipGroup
            values={seasons}
            selected={season}
            onSelect={(value) => setSeason(value as Season)}
          />
        </Panel>

        <Panel icon={Sparkles} title="Style">
          <ChipGroup values={styles} selected={style} onSelect={setStyle} />
        </Panel>

        <Panel icon={Palette} title="Color Palette">
          <div className="flex flex-wrap gap-2">
            {paletteOptions.map((color) => {
              const selected = palette.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    selected
                      ? "border-bronze bg-gradient-to-r from-forest to-bronze text-white shadow-glow"
                      : "border-white/10 bg-white/[0.08] text-white/60 hover:border-white/20 hover:bg-white/[0.12]"
                  )}
                  onClick={() => togglePalette(color)}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel icon={CheckCircle2} title="Preview">
          <div className="surface rounded-[1.5rem] p-3">
            <div className="flex gap-3">
              <div className="soft-edge h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Small preview"
                    className="image-polish h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  {style} for {occasion.toLowerCase()}
                </p>
                <p className="mt-1 line-clamp-3 text-sm leading-5 text-white/60">
                  {caption || "Your caption will appear here before publishing."}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {palette.map((color) => (
                    <span
                      key={color}
                      className="rounded-full bg-white/10 px-2 py-1 text-[0.68rem] text-white/60"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            variant="forest"
            size="lg"
            className="w-full"
            onClick={publish}
          >
            <Send className="h-4 w-4" />
            Publish
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {published ? (
          <motion.div
            className="fixed inset-x-4 bottom-28 z-40 mx-auto max-w-[398px] rounded-[1.5rem] border border-bronze/40 bg-gradient-to-r from-forest to-bronze px-4 py-4 text-white shadow-glow"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6" />
              <div>
                <p className="font-semibold">Outfit published</p>
                <p className="text-sm text-white/70">
                  Mock success saved to the local flow.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Panel({
  icon: Icon,
  title,
  children
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      className="surface rounded-[1.5rem] p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-bronze-soft" />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function ChipGroup({
  values,
  selected,
  onSelect
}: {
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition",
            selected === value
              ? "border-bronze bg-gradient-to-r from-forest to-bronze text-white shadow-glow"
              : "border-white/10 bg-white/[0.08] text-white/60 hover:border-white/20 hover:bg-white/[0.12]"
          )}
          onClick={() => onSelect(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
