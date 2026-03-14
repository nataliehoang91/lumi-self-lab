"use client";

import { useState } from "react";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";
import {
  READ_FONT_SIZES,
  READ_FONT_FACES_EN,
  READ_FONT_FACES_VI,
  type ReadFontSize,
} from "../readTextConstants";

export function ReadTextSettings() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const { readFontSize, setReadFontSize, readFontFace, setReadFontFace, leftVersion } =
    useRead();

  const [open, setOpen] = useState(false);
  const sizeIndex = READ_FONT_SIZES.indexOf(readFontSize);
  const sliderValue = sizeIndex >= 0 ? sizeIndex : 2; // M

  /** Use second (warm) for both Vietnamese and English – match image: dark second for active, warm beige (second/10) for inactive. */
  const pillClass =
    "border-second bg-second/10 text-second-dark dark:bg-second/20 dark:text-second-foreground";
  const selectedFontBtnClass = "border-second bg-second text-second-foreground";
  const sliderAccentClass =
    "[&_[data-slot=slider-range]]:bg-second [&_[data-slot=slider-thumb]]:border-second";
  const sizeLabelActiveClass = "text-second font-medium";

  /** Show Vietnamese fonts only when VI is selected; for NIV/KJV (and zh) show English fonts only. */
  const fontFaces = leftVersion === "vi" ? READ_FONT_FACES_VI : READ_FONT_FACES_EN;
  const effectiveFaceId =
    readFontFace && fontFaces.some((f) => f.id === readFontFace)
      ? readFontFace
      : (fontFaces[0]?.id ?? "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-lg"
          aria-label={t("readTextSize")}
        >
          <Type className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        collisionPadding={16}
        className="flex max-w-2xl min-w-sm flex-col gap-5 rounded-lg p-4 shadow-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Text Size */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">
              {t("readTextSize")}
            </span>
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-sm font-medium",
                pillClass
              )}
            >
              {readFontSize}
            </span>
          </div>
          <div className={cn("px-1", sliderAccentClass)}>
            <Slider
              min={0}
              max={READ_FONT_SIZES.length - 1}
              step={1}
              value={[sliderValue]}
              onValueChange={([v]) => {
                const size =
                  READ_FONT_SIZES[
                    Math.max(0, Math.min(v ?? 0, READ_FONT_SIZES.length - 1))
                  ];
                if (size) setReadFontSize(size);
              }}
              className="w-full"
            />
            <div className="text-muted-foreground mt-2 flex justify-between text-xs">
              {READ_FONT_SIZES.map((s) => (
                <span key={s} className={cn(s === readFontSize && sizeLabelActiveClass)}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Font */}
        <div className="flex flex-col gap-2">
          <span className="text-foreground text-sm font-medium">{t("readFont")}</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {fontFaces.map((face) => {
              const isSelected = face.id === effectiveFaceId;
              return (
                <Button
                  key={face.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    `h-auto min-h-9 rounded-full border px-3 py-1.5 text-sm font-medium
                    transition-all`,
                    isSelected ? selectedFontBtnClass : pillClass,
                    face.className
                  )}
                  style={face.fontFamily ? { fontFamily: face.fontFamily } : undefined}
                  onClick={() => setReadFontFace(face.id)}
                >
                  {face.label}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
