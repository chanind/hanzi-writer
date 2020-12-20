import { fakeXhr, FakeXMLHttpRequest, FakeXMLHttpRequestStatic } from 'nise';
import ren from 'hanzi-writer-data/人.json';
import defaultCharDataLoader from '../defaultCharDataLoader';

let xhr: FakeXMLHttpRequestStatic;
let requests: FakeXMLHttpRequest[];

beforeEach(() => {
  requests = [];
  xhr = fakeXhr.useFakeXMLHttpRequest();
  xhr.onCreate = function (req) {
    requests.push(req);
  };
});

afterEach(() => {
  xhr.restore();
});

describe('defaultCharDataLoader', () => {
  it('loads char data from the jsdelivr CDN', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();

    defaultCharDataLoader('人', onLoad, onError);

    expect(requests.length).toBe(1);
    expect(requests[0].url).toBe(
      'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/人.json',
    );

    requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(ren));

    expect(onError).not.toHaveBeenCalled();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledWith(ren);
  });

  it('calls onError if a non-200 response is returned', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();

    defaultCharDataLoader('Q', onLoad, onError);

    expect(requests.length).toBe(1);
    expect(requests[0].url).toBe(
      'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/Q.json',
    );

    requests[0].respond(
      404,
      { 'Content-Type': 'text/plain' },
      "Couldn't find the requested file /Q.json in hanzi-writer-data.",
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onLoad).not.toHaveBeenCalled();
  });

  it('calls onError if a network error occurs', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();

    defaultCharDataLoader('人', onLoad, onError);

    expect(requests.length).toBe(1);

    requests[0].error();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onLoad).not.toHaveBeenCalled();
  });
});
