const fakeXhr = require('nise').fakeXhr;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'defaultCha... Remove this comment to see the full error message
const defaultCharDataLoader = require('../defaultCharDataLoader');


let xhr: any;
let requests: any;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
beforeEach(() => {
  requests = [];
  xhr = fakeXhr.useFakeXMLHttpRequest();
  xhr.onCreate = function(req: any) {
    requests.push(req);
  };
});

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
afterEach(() => {
  xhr.restore();
});


// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('defaultCharDataLoader', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('loads char data from the jsdelivr CDN', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onLoad = jest.fn();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onError = jest.fn();

    defaultCharDataLoader('人', onLoad, onError);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests.length).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests[0].url).toBe('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/人.json');

    requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(ren));

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onError).not.toHaveBeenCalled();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onLoad).toHaveBeenCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onLoad).toHaveBeenCalledWith(ren);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls onError if a non-200 response is returned', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onLoad = jest.fn();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onError = jest.fn();

    defaultCharDataLoader('Q', onLoad, onError);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests.length).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests[0].url).toBe('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/Q.json');

    requests[0].respond(404, { 'Content-Type': 'text/plain' }, "Couldn't find the requested file /Q.json in hanzi-writer-data.");

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onError).toHaveBeenCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onLoad).not.toHaveBeenCalled();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls onError if a network error occurs', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onLoad = jest.fn();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    const onError = jest.fn();

    defaultCharDataLoader('人', onLoad, onError);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(requests.length).toBe(1);

    requests[0].error();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onError).toHaveBeenCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(onLoad).not.toHaveBeenCalled();
  });
});
