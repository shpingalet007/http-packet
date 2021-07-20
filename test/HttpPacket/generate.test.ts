import chai from 'chai';

import HttpPacket from '../../src/class';
import AuthTypes from '../../src/enums/auth';
import RequestMethods from '../../src/enums/methods';
import Encodings from '../../src/enums/encodings';
import HttpVersions from '../../src/enums/httpVersions';

describe('Export request to string. Checking some variations', () => {
  it('CONNECT request. Text/plain', () => {
    const req = new HttpPacket({
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
      'Content-Length: 12',
      '\r\nTest content',
    ].join('\r\n');
    const requestString = req.generate();

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('PUT request. Text/plain', () => {
    const req = new HttpPacket({
      method: RequestMethods.Put,
      url: 'example.com',
    });

    const expectedReq = [
      'PUT / HTTP/1.1',
      'Host: example.com',
      '\r\n',
    ].join('\r\n');
    const requestString = req.generate();

    chai.expect(expectedReq).to.deep.equal(requestString);
  });
  it('OPTIONS request. Application/json', () => {
    const req = new HttpPacket({
      method: RequestMethods.Options,
      url: 'example.com',
      body: {
        encoding: Encodings.Json,
        content: {
          a: 100,
          b: 200,
          c: 300,
        },
      },
    });

    const expectedReq = [
      'OPTIONS / HTTP/1.1',
      'Host: example.com',
      'Content-Type: application/json',
      'Content-Length: 25',
      '\r\n{"a":100,"b":200,"c":300}',
    ].join('\r\n');
    const requestString = req.generate();

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('POST request. Application/x-www-form-urlencoded', () => {
    const req = new HttpPacket({
      method: RequestMethods.Post,
      url: 'example.com',
      body: {
        encoding: Encodings.FormUrlencoded,
        content: {
          a: 100,
          b: 200,
          c: 300,
        },
      },
    });

    const expectedReq = [
      'POST / HTTP/1.1',
      'Host: example.com',
      'Content-Type: application/x-www-form-urlencoded',
      'Content-Length: 17',
      '\r\na=100&b=200&c=300',
    ].join('\r\n');
    const requestString = req.generate();

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('Request with authentication. Basic', () => {
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
});
describe('Export request to bytes. Checking some variations', () => {
  it('CONNECT request. Text/plain', () => {
    const req = new HttpPacket({
      version: HttpVersions.v2_0,
      method: RequestMethods.Connect,
      url: 'example.com/api/1/getData?a=100',
      headers: {
        UserAgent: 'HttpPacket module',
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
      'Content-Length: 12',
      '\r\nTest content',
    ].join('\r\n');
    const requestBytes = req.generate('buffer');

    // @ts-ignore
    const requestString = HttpPacket.convertBytesToString(requestBytes);

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('PUT request. Text/plain', () => {
    const req = new HttpPacket({
      method: RequestMethods.Put,
      url: 'example.com',
    });

    const expectedReq = [
      'PUT / HTTP/1.1',
      'Host: example.com',
      '\r\n',
    ].join('\r\n');
    const requestBytes = req.generate('buffer');

    // @ts-ignore
    const requestString = HttpPacket.convertBytesToString(requestBytes);

    chai.expect(expectedReq).to.deep.equal(requestString);
  });
  it('OPTIONS request. Application/json', () => {
    const req = new HttpPacket({
      method: RequestMethods.Options,
      url: 'example.com',
      body: {
        encoding: Encodings.Json,
        content: {
          a: 100,
          b: 200,
          c: 300,
        },
      },
    });

    const expectedReq = [
      'OPTIONS / HTTP/1.1',
      'Host: example.com',
      'Content-Type: application/json',
      'Content-Length: 25',
      '\r\n{"a":100,"b":200,"c":300}',
    ].join('\r\n');
    const requestBytes = req.generate('buffer');

    // @ts-ignore
    const requestString = HttpPacket.convertBytesToString(requestBytes);

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('POST request. Application/x-www-form-urlencoded', () => {
    const req = new HttpPacket({
      method: RequestMethods.Post,
      url: 'example.com',
      body: {
        encoding: Encodings.FormUrlencoded,
        content: {
          a: 100,
          b: 200,
          c: 300,
        },
      },
    });

    const expectedReq = [
      'POST / HTTP/1.1',
      'Host: example.com',
      'Content-Type: application/x-www-form-urlencoded',
      'Content-Length: 17',
      '\r\na=100&b=200&c=300',
    ].join('\r\n');
    const requestBytes = req.generate('buffer');

    // @ts-ignore
    const requestString = HttpPacket.convertBytesToString(requestBytes);

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
});
