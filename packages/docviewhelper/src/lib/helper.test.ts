import { getViewerDetails } from './helper';

describe(`test url`, () => {
  it('works', () => {
    const url = getViewerDetails(
      'http://www.africau.edu/images/default/sample.pdf'
    );
    expect(url).toBeDefined();
    expect(url.url).toContain('docs.google.com/gview');
    expect(url.url).toContain('http%3A%2F%2Fwww.africau.edu%2Fimages%2Fdefault%2Fsample.pdf');
  });
});
