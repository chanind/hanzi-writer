import React, {
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react";
import HanziWriter, { HanziWriterOptions, QuizOptions } from "hanzi-writer";

export type HanziWriterComponentProps = {
  className?: string;
  char: string;
  quiz?: {
    active: boolean;
    options: Partial<QuizOptions>;
  };
  children?: React.ReactNode;
  options: Partial<HanziWriterOptions>;
};

/**
 * React component for the `"hanzi-writer"` library
 */
const HanziWriterComponent = React.forwardRef<
  HanziWriter | undefined,
  HanziWriterComponentProps
>((props, ref) => {
  const writer = useRef<HanziWriter>();

  const elementId = useMemo(() => `char-${props.char}-${new Date().getTime()}`, [
    props.char,
  ]);

  useLayoutEffect(() => {
    if (writer.current) {
      writer.current?.setCharacter(props.char).catch((err) => {
        console.warn(err);
      });
      return;
    }

    // Create new character
    writer.current = HanziWriter.create(elementId, props.char, {
      ...(props.options || {}),
      width: 400,
      height: 400,
    });
  }, [elementId, props.char]);

  // Toggle quiz
  useLayoutEffect(() => {
    if ("quiz" in props) {
      if (props.quiz?.active) {
        writer.current?.quiz(props.quiz.options);
      } else {
        writer.current?.cancelQuiz({
          resetDisplay: true,
        });
      }
    }
  }, [props.char, props.quiz]);

  // Toggle show/hide character
  useUpdateEffect(() => {
    if ("showCharacter" in props.options) {
      if (props.options.showCharacter) {
        writer.current?.showCharacter();
      } else {
        writer.current?.hideCharacter();
      }
    }
  }, [props.options.showCharacter]);

  // Toggle show/hide outline
  useUpdateEffect(() => {
    if ("showOutline" in props.options) {
      if (!props.options.showOutline) {
        writer.current?.hideOutline();
      } else {
        writer.current?.showOutline();
      }
    }
  }, [props.options.showCharacter, props.options.showOutline]);

  useImperativeHandle(ref, () => writer.current);

  return (
    <div id={elementId} className={props.className}>
      {props.children || null}
    </div>
  );
});

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 */
export function useUpdateEffect(effect: () => any, dependencies: any[] = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
    // eslint-disable-next-line
  }, dependencies);
}

export default HanziWriterComponent;
