import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import ren from "hanzi-writer-data/人.json";
import { defaultCharDataLoader } from "../defaultOptions";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("defaultCharDataLoader", () => {
  it("loads char data from the jsdelivr CDN", async () => {
    fetchMock.mockOnce(JSON.stringify(ren));

    const onError = jest.fn();

    const response = await new Promise((onLoad) => {
      defaultCharDataLoader("人", onLoad, onError);
    });

    expect(fetchMock.mock.calls.length).toBe(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/人.json",
    );

    expect(onError).not.toHaveBeenCalled();
    expect(response).toMatchObject(ren);
  });

  it("calls onError if a non-200 response is returned", async () => {
    const url = "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/Q.json";

    fetchMock.mockResponse(
      "Couldn't find the requested file /Q.json in hanzi-writer-data.",
      { headers: { "Content-Type": "text/plain" }, status: 404 },
    );

    const onLoad = jest.fn();

    await new Promise((onError) => {
      defaultCharDataLoader("Q", onLoad, onError);
    });

    expect(fetchMock.mock.calls.length).toBe(1);
    expect(fetchMock.mock.calls[0][0]).toBe(url);

    expect(onLoad).not.toHaveBeenCalled();
  });

  it("calls onError if a network error occurs", async () => {
    fetchMock.mockReject();
    const onLoad = jest.fn();

    await new Promise((onError) => {
      defaultCharDataLoader("人", onLoad, onError);
    });

    expect(fetchMock.mock.calls.length).toBe(1);

    expect(onLoad).not.toHaveBeenCalled();
  });
});
