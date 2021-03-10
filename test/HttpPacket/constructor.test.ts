import chai from 'chai';

import HttpPacket from '../../src/class';
import RequestMethods from '../../src/enums/methods';
import Encodings from '../../src/enums/encodings';
import HttpVersions from '../../src/enums/httpVersions';

describe('Constructor checks', () => {
  it('Providing only URL. Checking default params', () => {
    const req = new HttpPacket({
      url: 'example.com',
    });

    // HTTP version must be 1.1 by default
    chai.expect(req.version).to.equal('1.1');

    // Request method must be GET by default
    chai.expect(req.method).to.equal(RequestMethods.Get);

    // Request path if not extracted must be '/'
    chai.expect(req.path).to.equal('/');

    // Request URL query parameters
    chai.expect(req.query).to.deep.equal({});
  });
  it('Providing all parameters', () => {
    const req = new HttpPacket({
      version: HttpVersions.v2_0,
      method: RequestMethods.Connect,
      url: 'example.com/api/1/getData?a=100',
      headers: {
        'User-Agent': 'HttpPacket module',
      },
      queryParams: {
        b: 200,
        c: 300,
      },
      body: {
        encoding: Encodings.TextPlain,
        content: 'Test content',
      },
    });

    // HTTP version must be 1.1 by default
    chai.expect(req.version).to.equal(HttpVersions.v2_0);

    // Request method must be GET by default
    chai.expect(req.method).to.equal(RequestMethods.Connect);

    // URL is as provided
    chai.expect(req.host).to.equal('example.com');

    // Request path if not extracted must be '/'
    chai.expect(req.path).to.equal('/api/1/getData');

    // Request URL query parameters
    chai.expect(req.query).to.have.property('a').and.equal('100');
    chai.expect(req.query).to.have.property('b').and.equal(200);
    chai.expect(req.query).to.have.property('c').and.equal(300);

    // Body is as provided in constructor
    chai.expect(req.encoding).to.equal(Encodings.TextPlain);
    chai.expect(req.body).to.equal('Test content');
  });
});
