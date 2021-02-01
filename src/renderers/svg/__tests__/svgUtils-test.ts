import { urlIdRef } from '../svgUtils';

describe('urlIdRef', () => {
  it('prepends the ID with the current window location', () => {
    (global as any).jsdom.reconfigure({
      url: 'https://test.com',
    });
    expect(urlIdRef('123-blah')).toEqual('url("https://test.com/#123-blah")');
  });

  it('escapes " characters in the URL', () => {
    (global as any).jsdom.reconfigure({
      url: 'https://test-"(ok).com',
    });
    expect(urlIdRef('123-blah')).toEqual('url("https://test-%22(ok).com/#123-blah")');
  });

  it('strips everything after # in the URL', () => {
    (global as any).jsdom.reconfigure({
      url: 'https://test.com/path#existing-hash',
    });
    expect(urlIdRef('123-blah')).toEqual('url("https://test.com/path#123-blah")');
  });
});
