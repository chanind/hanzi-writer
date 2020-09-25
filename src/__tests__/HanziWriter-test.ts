import ren from "hanzi-writer-data/人.json";
import yi from "hanzi-writer-data/一.json";
import HanziWriter from "../HanziWriter";
import { timeout } from "../utils";
import Quiz from "../Quiz";
import { CharacterJson, CharDataLoaderFn } from "../typings/types";
import { resolvePromises } from "../testUtils";

const charDataLoader: CharDataLoaderFn = () => ren as CharacterJson;

jest.mock("../Quiz");

describe("HanziWriter", () => {
  beforeEach(() => {
    // @ts-ignore
    Quiz.mockClear();
  });

  describe("constructor", () => {
    it("can optionally run init() if element and options are passed in", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = HanziWriter.create("target", { charDataLoader });
      writer.setCharacter("人");

      await writer._withDataPromise;

      expect(document.querySelectorAll("#target svg").length).toBe(1);
      const svg = document.querySelector("#target svg") as SVGElement;
      expect(svg.childNodes.length).toBe(2);
      expect(svg.childNodes[0].nodeName).toBe("defs");
      expect(svg.childNodes[1].nodeName).toBe("g");
      // the characters are repeated 3 times - one for outline, character, and highlight
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      svg.childNodes[1].childNodes.forEach((charNode) => {
        expect(charNode.nodeName).toBe("g");
        // 2 strokes per character
        expect(charNode.childNodes.length).toBe(2);
      });
    });

    it("[deprecated] loads data and builds an instance in a dom element", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = HanziWriter.create("target", "人", { charDataLoader });

      await writer._withDataPromise;

      expect(document.querySelectorAll("#target svg").length).toBe(1);
      const svg = document.querySelector("#target svg") as SVGElement;
      expect(svg.childNodes.length).toBe(2);
      expect(svg.childNodes[0].nodeName).toBe("defs");
      expect(svg.childNodes[1].nodeName).toBe("g");
      // the characters are repeated 3 times - one for outline, character, and highlight
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      svg.childNodes[1].childNodes.forEach((charNode) => {
        expect(charNode.nodeName).toBe("g");
        // 2 strokes per character
        expect(charNode.childNodes.length).toBe(2);
      });
    });
  });

  describe("HanziWriter.create", () => {
    it("loads data and builds an instance in a dom element", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = HanziWriter.create("target", "人", { charDataLoader });

      await writer._withDataPromise;

      expect(document.querySelectorAll("#target svg").length).toBe(1);
      const svg = document.querySelector("#target svg") as SVGElement;
      expect(svg.childNodes.length).toBe(2);
      expect(svg.childNodes[0].nodeName).toBe("defs");
      expect(svg.childNodes[1].nodeName).toBe("g");
      // the characters are repeated 3 times - one for outline, character, and highlight
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      svg.childNodes[1].childNodes.forEach((charNode) => {
        expect(charNode.nodeName).toBe("g");
        // 2 strokes per character
        expect(charNode.childNodes.length).toBe(2);
      });
    });

    it("Errors if the target element can't be found", () => {
      document.body.innerHTML = '<div id="target"></div>';
      expect(() => {
        HanziWriter.create("wrong-target", "人", { charDataLoader });
      }).toThrow("HanziWriter target element not found: wrong-target");
    });

    it("can optionally use a canvas for rendering instead of SVG", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = HanziWriter.create("target", "人", {
        charDataLoader,
        renderer: "canvas",
      });

      await writer._withDataPromise;

      expect(document.querySelectorAll("#target canvas").length).toBe(1);
      const canvas = document.querySelector("#target canvas") as HTMLCanvasElement;
      expect(canvas.getContext("2d")).toMatchSnapshot();
    });
  });

  describe("data loading", () => {
    it("calls onLoadCharDataError if provided on loading failure", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const onLoadCharDataError = jest.fn();
      const writer = HanziWriter.create("target", "人", {
        onLoadCharDataError,
        charDataLoader: () => Promise.reject("reasons"),
      });

      await writer._withDataPromise;

      expect(onLoadCharDataError.mock.calls.length).toBe(1);
      expect(onLoadCharDataError.mock.calls[0][0]).toBe("reasons");
    });

    it("throws when calling an animatable method after loading failure", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const onLoadCharDataError = jest.fn();
      const writer = HanziWriter.create("target", "人", {
        onLoadCharDataError,
        charDataLoader(char, onComplete, onErr) {
          onErr("reasons");
        },
      });

      await writer._withDataPromise;
      expect(() => writer.showCharacter()).toThrow();

      expect(onLoadCharDataError).toHaveBeenCalledTimes(1);
      expect(onLoadCharDataError).toHaveBeenCalledWith("reasons");
    });

    it("throws an error on loading fauire if onLoadCharDataError is not provided", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const error = new Error("reasons");

      const writer = HanziWriter.create("target", "人", {
        charDataLoader(char, onComplete, onErr) {
          onErr(error);
        },
      });

      await expect(writer._withDataPromise).rejects.toThrow(error);
    });
  });

  describe("setCharacter", () => {
    it("deletes the current character while loading", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        charDataLoader(char) {
          return timeout(1).then(() =>
            char === "人" ? (ren as CharacterJson) : (yi as CharacterJson),
          );
        },
      });
      await writer._withDataPromise;

      expect(document.querySelector("#target svg g")).not.toBe(null);
      expect(document.querySelector("#target svg defs *")).not.toBe(null);
      writer.setCharacter("一");
      expect(document.querySelector("#target svg g")).toBe(null);
      expect(document.querySelector("#target svg defs *")).toBe(null);

      await writer._withDataPromise;
      expect(document.querySelector("#target svg g")?.childNodes.length).toBe(3);
      expect(document.querySelector("#target svg defs *")).not.toBe(null);
    });

    it("maintains the visibility of the character from the last character rendered", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        charDataLoader(char) {
          return timeout(1).then(() =>
            char === "人" ? (ren as CharacterJson) : (yi as CharacterJson),
          );
        },
      });
      await writer._withDataPromise;

      writer.hideOutline();
      await writer.setCharacter("一");
      expect(writer._renderState?.state.character.main.opacity).toBe(1);
      expect(writer._renderState?.state.character.outline.opacity).toBe(0);
    });

    it("maintains the visibility of the outline from the last character rendered", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        charDataLoader(char) {
          return timeout(1).then(() =>
            char === "人" ? (ren as CharacterJson) : (yi as CharacterJson),
          );
        },
      });
      await writer._withDataPromise;

      writer.hideCharacter();
      writer.setCharacter("一");
      await writer._withDataPromise;
      expect(writer._renderState?.state.character.main.opacity).toBe(0);
      expect(writer._renderState?.state.character.outline.opacity).toBe(1);
    });

    it("maintains colors from the last character rendered", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        charDataLoader(char) {
          return timeout(1).then(() =>
            char === "人" ? (ren as CharacterJson) : (yi as CharacterJson),
          );
        },
      });
      await writer._withDataPromise;

      writer.updateColor("strokeColor", "rgba(30, 30, 30, 0.8)");
      writer.updateColor("outlineColor", "rgba(10, 20, 30, 0.1)");
      writer.setCharacter("一");
      await writer._withDataPromise;
      expect(writer._renderState?.state.options.strokeColor).toEqual({
        r: 30,
        g: 30,
        b: 30,
        a: 0.8,
      });
      expect(writer._renderState?.state.options.outlineColor).toEqual({
        r: 10,
        g: 20,
        b: 30,
        a: 0.1,
      });
    });
  });

  describe("animateCharacter", () => {
    it("animates and returns promise that resolves when animation is finished", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        showCharacter: true,
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      const promise = writer.animateCharacter({ onComplete });

      promise.then((result) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState!.state.character.main.opacity).toBe(1);
      expect(writer._renderState!.state.character.main.strokes[0].opacity).toBe(1);
      expect(writer._renderState!.state.character.main.strokes[0].displayPortion).toBe(0);

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState!.state.character.main.strokes[0].displayPortion).toBe(1);

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState!.state.character.main.strokes[1].displayPortion).toBe(0);
      expect(isResolved).toBe(false);
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState!.state.character.main.strokes[1].displayPortion).toBe(1);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  describe("animateStroke", () => {
    it("animates and returns promise that resolves when animation is finished", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        showCharacter: true,
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer.animateStroke(1, { onComplete }).then((result) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      expect(writer._renderState!.state.character.main.opacity).toBe(1);
      expect(writer._renderState!.state.character.main.strokes[0].opacity).toBe(1);
      expect(writer._renderState!.state.character.main.strokes[1].opacity).toBe(1);

      expect(writer._renderState!.state.character.main.strokes[0].displayPortion).toBe(1);
      expect(writer._renderState!.state.character.main.strokes[1].displayPortion).toBe(0);
      expect(isResolved).toBe(false);
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState!.state.character.main.strokes[0].displayPortion).toBe(1);
      expect(writer._renderState!.state.character.main.strokes[1].displayPortion).toBe(1);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });

    it("keeps other stroke opacities where they were originally", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        showCharacter: true,
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer.hideCharacter({ duration: 0 });
      await resolvePromises();

      expect(writer._renderState?.state.character.main.opacity).toBe(0);
      expect(writer._renderState?.state.character.main.strokes[0].opacity).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[1].opacity).toBe(1);

      writer.animateStroke(1, { onComplete }).then((result) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      expect(writer._renderState?.state.character.main.opacity).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[0].opacity).toBe(0);
      expect(writer._renderState?.state.character.main.strokes[1].opacity).toBe(1);

      expect(isResolved).toBe(false);
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState?.state.character.main.strokes[0].displayPortion).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(1);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  describe("pauseAnimation and resumeAnimation", () => {
    it("pauses and resumes the currently running animations", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        showCharacter: true,
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      clock.tick(50);
      await resolvePromises();

      writer.animateStroke(1, { onComplete }).then((result) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();
      expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(0);

      clock.tick(50);
      await resolvePromises();

      const pausedDisplayPortion =
        writer._renderState?.state.character.main.strokes[1].displayPortion;
      expect(pausedDisplayPortion).toBeGreaterThan(0);
      expect(pausedDisplayPortion).toBeLessThan(1);
      expect(isResolved).toBe(false);

      writer.pauseAnimation();
      await resolvePromises();

      clock.tick(2000);
      await resolvePromises();

      expect(isResolved).toBe(false);
      expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(
        pausedDisplayPortion,
      );

      writer.resumeAnimation();
      await resolvePromises();

      clock.tick(50);
      await resolvePromises();

      const newDisplayPortion =
        writer._renderState?.state.character.main.strokes[1].displayPortion;
      expect(newDisplayPortion).not.toBe(pausedDisplayPortion);
      expect(newDisplayPortion).toBeGreaterThan(0);
      expect(newDisplayPortion).toBeLessThan(1);
      expect(isResolved).toBe(false);

      clock.tick(2000);
      await resolvePromises();

      expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(1);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  describe("highlightStroke", () => {
    it("doesn't do anything if no character has been set", async () => {
      const onComplete = jest.fn();

      const writer = HanziWriter.create("target", {
        showCharacter: true,
        charDataLoader,
      });

      await writer.highlightStroke(1, { onComplete });

      expect(onComplete).not.toHaveBeenCalled();
    });
    it("highlights a single stroke", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        showCharacter: true,
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer.highlightStroke(1, { onComplete }).then((result) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      expect(writer._renderState?.state.character.highlight.opacity).toBe(1);
      expect(writer._renderState?.state.character.highlight.strokes[0].opacity).toBe(0);
      expect(writer._renderState?.state.character.highlight.strokes[1].opacity).toBe(0);

      expect(
        writer._renderState?.state.character.highlight.strokes[1].displayPortion,
      ).toBe(0);
      expect(isResolved).toBe(false);
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(
        writer._renderState?.state.character.highlight.strokes[1].displayPortion,
      ).toBe(1);
      expect(writer._renderState?.state.character.highlight.strokes[1].opacity).toBe(1);

      clock.tick(1000);
      await resolvePromises();

      expect(
        writer._renderState?.state.character.highlight.strokes[1].displayPortion,
      ).toBe(1);
      expect(writer._renderState?.state.character.highlight.strokes[1].opacity).toBe(0);

      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  describe("loopCharacterAnimation", () => {
    it("animates and then repeats until something else stops it", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        showCharacter: true,
        charDataLoader,
      });
      await writer._withDataPromise;

      writer.loopCharacterAnimation();

      await resolvePromises();

      // loop 5 times
      for (let i = 0; i < 5; i++) {
        expect(writer._renderState?.state.character.main.opacity).toBe(1);
        [0, 1].forEach((strokeNum) => {
          expect(
            writer._renderState?.state.character.main.strokes[strokeNum].opacity,
          ).toBe(1);
        });

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState?.state.character.main.opacity).toBe(1);
        expect(writer._renderState?.state.character.main.strokes[0].opacity).toBe(1);
        expect(writer._renderState?.state.character.main.strokes[0].displayPortion).toBe(
          0,
        );

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState?.state.character.main.strokes[0].displayPortion).toBe(
          1,
        );

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(
          0,
        );

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(
          1,
        );

        clock.tick(3000);
        await resolvePromises();
      }

      // now, stop the animation by running something different
      writer.showCharacter();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState?.state.character.main.opacity).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[0].opacity).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[0].displayPortion).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[1].opacity).toBe(1);
      expect(writer._renderState?.state.character.main.strokes[1].displayPortion).toBe(1);
    });
  });

  const hideMethods: Array<{
    method: "hideCharacter" | "hideOutline";
    stateLabel: "main" | "outline";
  }> = [
    {
      method: "hideCharacter",
      stateLabel: "main",
    },
    {
      method: "hideOutline",
      stateLabel: "outline",
    },
  ];

  hideMethods.forEach(({ method, stateLabel }) => {
    describe(method, () => {
      it("animates and returns promise that resolves when finished", async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = HanziWriter.create("target", "人", {
          showCharacter: true,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[method]({
          onComplete,
        }).then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(1);
        expect(isResolved).toBe(false);

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(0);

        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      it("returns instantly if char is already hidden", async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = HanziWriter.create("target", "人", {
          showCharacter: false,
          showOutline: false,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[method]({ onComplete }).then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

        expect(isResolved).toBe(false);

        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(0);
        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      it("resolves immediately if duration: 0 is passed", async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = HanziWriter.create("target", "人", {
          showCharacter: true,
          showOutline: true,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[method]({ onComplete, duration: 0 }).then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

        expect(isResolved).toBe(false);

        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(0);
        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });
    });
  });

  const showMethods: Array<{
    method: "showCharacter" | "showOutline";
    stateLabel: "main" | "outline";
  }> = [
    {
      method: "showCharacter",
      stateLabel: "main",
    },
    {
      method: "showOutline",
      stateLabel: "outline",
    },
  ];

  showMethods.forEach(({ method, stateLabel }) => {
    describe(method, () => {
      it("animates and returns promise that resolves when finished", async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = HanziWriter.create("target", "人", {
          [method]: false,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[method]({ onComplete }).then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(0);
        expect(isResolved).toBe(false);

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(1);

        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      it("returns instantly if already shown", async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = HanziWriter.create("target", "人", {
          [method]: true,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[method]({ onComplete }).then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

        expect(isResolved).toBe(false);

        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(1);
        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      it("resolves immediately if duration: 0 is passed", async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = HanziWriter.create("target", "人", {
          [method]: false,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[method]({ onComplete, duration: 0 }).then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

        expect(isResolved).toBe(false);

        await resolvePromises();

        expect(writer._renderState?.state.character[stateLabel].opacity).toBe(1);
        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });
    });
  });

  describe("updateColor", () => {
    it("animates and returns promise that resolves when finished", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        strokeColor: "#123",
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer
        .updateColor("strokeColor", "rgba(30, 30, 30, 0.8)", { onComplete })
        .then((result) => {
          isResolved = true;
          resolvedVal = result;
        });

      await resolvePromises();

      expect(writer._renderState?.state.options.strokeColor).toEqual({
        r: 17,
        g: 34,
        b: 51,
        a: 1,
      });
      expect(isResolved).toBe(false);

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState?.state.options.strokeColor).toEqual({
        r: 30,
        g: 30,
        b: 30,
        a: 0.8,
      });

      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });

    it("uses strokeColor for the tween if radicalColor is set to null", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", {
        strokeColor: "rgba(30, 30, 30, 0.8)",
        radicalColor: "#EEE",
        charDataLoader,
      });

      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      const promise = writer.updateColor("radicalColor", null, {
        onComplete,
        duration: 1000,
      });

      promise.then((result) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      expect(writer._renderState!.state.options.radicalColor).toEqual({
        r: 238,
        g: 238,
        b: 238,
        a: 1,
      });

      expect(isResolved).toBe(false);

      clock.tick(999);
      await resolvePromises();
      const { r, g, b, a } = writer._renderState!.state.options.radicalColor;

      expect(r).toBeCloseTo(30, 0);
      expect(g).toBeCloseTo(30, 0);
      expect(b).toBeCloseTo(30, 0);
      expect(a).toBeCloseTo(1, 0);
      clock.tick(30);
      await resolvePromises();

      expect(writer._renderState?.state.options.radicalColor).toBeNull();

      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  describe("quiz", () => {
    it("sets up and starts the quiz", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", { charDataLoader });
      const onComplete = jest.fn();
      writer.quiz({ onComplete });
      expect(Quiz).not.toHaveBeenCalled();
      await writer._withDataPromise;
      await resolvePromises();
      expect(Quiz).toHaveBeenCalledTimes(1);
      expect(Quiz).toHaveBeenCalledWith(
        writer._character,
        writer._renderState,
        writer._positioner,
      );
      expect(writer._quiz!.startQuiz).toHaveBeenCalledTimes(1);
      expect(writer._quiz!.startQuiz).toHaveBeenCalledWith({
        ...writer._options,
        onComplete,
      });
    });

    it("resets display options if cancelQuiz is called with `resetDisplay`", async () => {
      const writer = HanziWriter.create("target", "人", {
        charDataLoader,
        showCharacter: true,
        showOutline: false,
      });

      await writer._withDataPromise;
      writer.showCharacter = jest.fn();
      writer.hideCharacter = jest.fn();
      writer.showOutline = jest.fn();
      writer.hideOutline = jest.fn();

      // Start the quiz..
      await writer.quiz();

      expect(writer.showCharacter).toHaveBeenCalledTimes(0);
      expect(writer.showOutline).toHaveBeenCalledTimes(0);
      expect(writer.hideCharacter).toHaveBeenCalledTimes(0);
      expect(writer.hideOutline).toHaveBeenCalledTimes(0);

      writer.cancelQuiz({ resetDisplay: true });

      expect(writer.showCharacter).toHaveBeenCalledTimes(1);
      expect(writer.showOutline).toHaveBeenCalledTimes(0);
      expect(writer.hideCharacter).toHaveBeenCalledTimes(0);
      expect(writer.hideOutline).toHaveBeenCalledTimes(0);
    });

    it("doesn't reset display options if no options are provided to cancelQuiz", async () => {
      const writer = HanziWriter.create("target", "人", { charDataLoader });

      writer.showCharacter = jest.fn();
      writer.hideCharacter = jest.fn();
      writer.showOutline = jest.fn();
      writer.hideOutline = jest.fn();

      await writer.quiz();

      expect(writer.showCharacter).toHaveBeenCalledTimes(0);
      expect(writer.showOutline).toHaveBeenCalledTimes(0);
      expect(writer.hideCharacter).toHaveBeenCalledTimes(0);
      expect(writer.hideOutline).toHaveBeenCalledTimes(0);

      writer.cancelQuiz();

      expect(writer.showCharacter).toHaveBeenCalledTimes(0);
      expect(writer.showOutline).toHaveBeenCalledTimes(0);
      expect(writer.hideCharacter).toHaveBeenCalledTimes(0);
      expect(writer.hideOutline).toHaveBeenCalledTimes(0);
    });
  });

  describe("cancelQuiz", () => {
    it("cancels the existing quiz", async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = HanziWriter.create("target", "人", { charDataLoader });
      await writer.quiz();
      const quiz = writer._quiz;
      writer.cancelQuiz();
      expect(quiz!.cancel).toHaveBeenCalledTimes(1);
      expect(writer._quiz).toBe(undefined);
    });
  });

  describe("mouse and touch events", () => {
    let writer: HanziWriter;
    beforeEach(async () => {
      document.body.innerHTML = '<div id="target"></div>';
      writer = HanziWriter.create("target", "人", { charDataLoader });
      await writer.quiz();
    });

    it("starts a user stroke on mousedown", () => {
      const evt = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: 170,
        clientY: 127,
      });
      const svg = document.querySelector("#target svg");
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg?.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz?.startUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz?.startUserStroke).toHaveBeenCalledWith({ x: 120, y: 67 });
    });

    it("starts a user stroke on touchstart", () => {
      const evt = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [
          {
            clientX: 170,
            clientY: 127,
          } as Touch,
        ],
      });
      const svg = document.querySelector("#target svg") as SVGElement;
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 } as DOMRect);
      const canceled = !svg.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz?.startUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz?.startUserStroke).toHaveBeenCalledWith({ x: 120, y: 67 });
    });

    it("continues a user stroke on mousemove", () => {
      const evt = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: 170,
        clientY: 127,
      });
      const svg = document.querySelector("#target svg") as SVGElement;
      // @ts-ignore
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz?.continueUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz?.continueUserStroke).toHaveBeenCalledWith({ x: 120, y: 67 });
    });

    it("continues a user stroke on touchmove", () => {
      const evt = new TouchEvent("touchmove", {
        bubbles: true,
        cancelable: true,
        touches: [
          {
            clientX: 170,
            clientY: 127,
          } as Touch,
        ],
      });
      const svg = document.querySelector("#target svg");
      expect(svg).toBeTruthy();

      // @ts-ignore (overriding default getBoundingClientRect)
      svg!.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg?.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz?.continueUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz?.continueUserStroke).toHaveBeenCalledWith({ x: 120, y: 67 });
    });

    it("ends a user stroke on mouseup", () => {
      const evt = new MouseEvent("mouseup", { bubbles: true, cancelable: true });
      const svg = document.querySelector("#target svg");
      svg?.dispatchEvent(evt);
      expect(writer._quiz?.endUserStroke).toHaveBeenCalledTimes(1);
    });

    it("ends a user stroke on touchend", () => {
      const evt = new TouchEvent("touchend", { bubbles: true, cancelable: true });
      const svg = document.querySelector("#target svg");
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.dispatchEvent(evt);
      expect(writer._quiz?.endUserStroke).toHaveBeenCalledTimes(1);
    });
  });

  describe("loadCharacterData", () => {
    it("calls onLoadCharDataError if provided on loading failure", async () => {
      const onLoadCharDataError = jest.fn();
      const loadingPromise = HanziWriter.loadCharacterData("人", {
        onLoadCharDataError,
        charDataLoader() {
          return Promise.reject("reasons");
        },
      });

      await loadingPromise;

      expect(onLoadCharDataError.mock.calls.length).toBe(1);
      expect(onLoadCharDataError.mock.calls[0][0]).toBe("reasons");
    });

    it("throws an error on loading fauire if onLoadCharDataError is not provided", async () => {
      const loadingPromise = HanziWriter.loadCharacterData("人", {
        charDataLoader(char, onComplete, onErr) {
          onErr(new Error("reasons"));
        },
      });

      await expect(loadingPromise).rejects.toThrow(new Error("reasons"));
    });

    it("returns the character data in a promise on success", async () => {
      const loadingPromise = HanziWriter.loadCharacterData("人", {
        charDataLoader() {
          return ren as CharacterJson;
        },
      });

      const result = await loadingPromise;
      expect(result).toBe(ren);
    });

    it("returns the character data in onLoadCharDataSuccess if provided", async () => {
      const onLoadCharDataSuccess = jest.fn();
      const loadingPromise = HanziWriter.loadCharacterData("人", {
        onLoadCharDataSuccess,
        charDataLoader() {
          return ren as CharacterJson;
        },
      });

      await loadingPromise;

      expect(onLoadCharDataSuccess.mock.calls.length).toBe(1);
      expect(onLoadCharDataSuccess.mock.calls[0][0]).toBe(ren);
    });

    it("uses lastLoadingManager if options match", async () => {
      const options = {
        charDataLoader() {
          return ren as CharacterJson;
        },
      };

      HanziWriter.loadCharacterData("人", options);
      const loadingManager = HanziWriter._loadingManager;

      HanziWriter.loadCharacterData("人", options);
      const loadingManagerTwo = HanziWriter._loadingManager;
      expect(loadingManager).toBe(loadingManagerTwo);
    });

    it("doesn't use lastLoadingManager if options change", async () => {
      HanziWriter.loadCharacterData("人", {
        charDataLoader() {
          return ren as CharacterJson;
        },
      });
      const loadingManager = HanziWriter._loadingManager;
      HanziWriter.loadCharacterData("人", {
        charDataLoader() {
          return yi as CharacterJson;
        },
      });
      const loadingManagerTwo = HanziWriter._loadingManager;
      expect(loadingManager).not.toBe(loadingManagerTwo);
    });
  });

  describe("getScalingTransform", () => {
    it("returns an object with info that can be used for scaling a makemeahanzi character in SVG", () => {
      expect(HanziWriter.getScalingTransform(100, 120, 10)).toEqual({
        scale: 0.078125,
        transform: "translate(10, 90.3125) scale(0.078125, -0.078125)",
        x: 10,
        y: 29.6875,
      });
    });

    it("uses 0 as the default padding", () => {
      expect(HanziWriter.getScalingTransform(100, 100)).toEqual({
        scale: 0.09765625,
        transform: "translate(0, 87.890625) scale(0.09765625, -0.09765625)",
        x: 0,
        y: 12.109375,
      });
    });
  });

  describe("option defaults", () => {
    it("works with legacy strokeAnimationDuration and strokeHighlightDuration if present", () => {
      const writer = HanziWriter.create("target", "人", {
        strokeAnimationDuration: 1000,
        strokeHighlightDuration: 250,
      });
      expect(writer._options.strokeAnimationSpeed).toBe(0.5);
      expect(writer._options.strokeHighlightSpeed).toBe(2);
    });

    it("sets highlightCompleteColor to highlightColor if not explicitly set", () => {
      const writer = HanziWriter.create("target", "人", { highlightColor: "#ABC" });
      expect(writer._options.highlightCompleteColor).toBe("#ABC");
    });

    it("sets highlightCompleteColor to the default highlightColor if none is passed", () => {
      const writer = HanziWriter.create("target", "人");
      expect(writer._options.highlightCompleteColor).toBe("#AAF");
    });
  });
});
