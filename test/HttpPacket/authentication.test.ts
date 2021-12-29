import chai from 'chai';

import HttpPacket from '../../src/class';
import AuthTypes from '../../src/enums/auth';
import HttpVersions from '../../src/enums/httpVersions';
import RequestMethods from '../../src/enums/methods';
import Encodings from '../../src/enums/encodings';

describe('Authentication support', () => {
  it('Basic authentication', () => {
    const req = new HttpPacket({
      authentication: {
        type: AuthTypes.Basic,
        credentials: {
          username: 'user',
          password: 'pass',
        },
      },
      version: HttpVersions.v2_0,
      method: RequestMethods.Connect,
      url: 'example.com/api/1/getData?a=100',
      headers: {
        'UserAgent': 'HttpPacket module',
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

    const expectedReq = [
      'CONNECT /api/1/getData?a=100&b=200&c=300 HTTP/2.0',
      'Host: example.com',
      'Content-Type: text/plain',
      'User-Agent: HttpPacket module',
      'Authorization: Basic dXNlcjpwYXNz',
      'Content-Length: 12',
      '\r\nTest content',
    ].join('\r\n');
    const requestString = req.generate();

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('Bearer token authentication', () => {
    const req = new HttpPacket({
      authentication: {
        type: AuthTypes.Bearer,
        credentials: {
          token: '49702166-4047-4d69-ad42-f15d60edaf16',
        },
      },
      version: HttpVersions.v2_0,
      method: RequestMethods.Connect,
      url: 'example.com/api/1/getData?a=100',
      headers: {
        'UserAgent': 'HttpPacket module',
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

    const expectedReq = [
      'CONNECT /api/1/getData?a=100&b=200&c=300 HTTP/2.0',
      'Host: example.com',
      'Content-Type: text/plain',
      'User-Agent: HttpPacket module',
      'Authorization: Bearer 49702166-4047-4d69-ad42-f15d60edaf16',
      'Content-Length: 12',
      '\r\nTest content',
    ].join('\r\n');
    const requestString = req.generate();

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
});
