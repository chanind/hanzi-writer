import React, { useLayoutEffect, useRef, useImperativeHandle, useMemo } from "react";
import HanziWriter, { HanziWriterOptions, QuizOptions, ColorOptions } from "hanzi-writer";
import { useCurrentRef, usePreviousRef, useUpdateEffect } from "./hooks";

// We don't want stale function references
type WithoutQuizOptions = Omit<HanziWriterOptions, keyof QuizOptions>;

export type HanziWriterComponentProps = {
  char: string;
  className?: string;
  children?: React.ReactNode;
} & Partial<WithoutQuizOptions>;

const colorOptions: Array<keyof ColorOptions> = [
  "strokeColor",
  "radicalColor",
  "highlightColor",
  "outlineColor",
  "drawingColor",
  "highlightCompleteColor",
];

/**
 * React component for the `"hanzi-writer"` library
 *
 * The ref of this component returns the HanziWriter class instance
 *
 */
const HanziWriterComponent = React.forwardRef<
  HanziWriter | undefined,
  HanziWriterComponentProps
>(({ char, className, children, ...options }, ref) => {
  const writer = useRef<HanziWriter>();
  const elementId = useMemo(() => `char-${char}-${new Date().getTime()}`, [char]);

  // The object reference will change with every re-render. Keeping a current ref avoids unnecessary effect invocations
  const optionsRef = useCurrentRef(options);
  // We'd like to compare our current options with the previous options inside effects
  // but not subscribe to object reference changes
  const previousOptionsRef = usePreviousRef(options);

  // Create a new instance of HanziWriter when the character changes
  useLayoutEffect(() => {
    if (writer.current) {
      writer.current?.setCharacter(char).catch((err) => {
        console.warn(err);
      });
      return;
    }

    // Create new character
    writer.current = HanziWriter.create(elementId, char, optionsRef.current || {});
  }, [elementId, char, optionsRef]);

  // Update colors
  useUpdateEffect(
    function onColorChange() {
      const prevOptions = previousOptionsRef.current || {};
      for (const colorKey of colorOptions) {
        const currentVal = options[colorKey];
        if (prevOptions[colorKey] !== currentVal && typeof currentVal !== "undefined") {
          writer.current?.updateColor(colorKey, currentVal);
        }
      }
    },
    [
      options.strokeColor,
      options.radicalColor,
      options.highlightColor,
      options.outlineColor,
      options.drawingColor,
      options.highlightCompleteColor,
    ],
  );

  // Toggle show/hide character
  useUpdateEffect(() => {
    const value = options.showCharacter ?? writer.current?._options.showCharacter;
    if (value) {
      writer.current?.showCharacter();
    } else {
      writer.current?.hideCharacter();
    }
  }, [options.showCharacter]);

  // Toggle show/hide outline
  useUpdateEffect(() => {
    const value = options.showOutline ?? writer.current?._options.showOutline;
    if (!value) {
      writer.current?.hideOutline();
    } else {
      writer.current?.showOutline();
    }
  }, [options.showOutline]);

  // Allows parent components to use the HanziWriter class instance through "ref"
  useImperativeHandle(ref, () => writer.current);

  return (
    <div id={elementId} className={className}>
      {children || null}
    </div>
  );
});

export default HanziWriterComponent;
