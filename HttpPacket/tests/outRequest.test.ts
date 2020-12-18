import chai from 'chai';

import HttpPacket from '../src/class';
import RequestMethods from '../src/enums/methods';
import Encodings from '../src/enums/encodings';
import HttpVersions from '../src/enums/httpVersions';

describe('Export request. Checking some variations', () => {
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
      '\nTest content',
    ].join('\n');
    const requestString = req.outRequest();

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
      '\n',
    ].join('\n');
    const requestString = req.outRequest();

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
      '\n{"a":100,"b":200,"c":300}',
    ].join('\n');
    const requestString = req.outRequest();

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
      '\na=100&b=200&c=300',
    ].join('\n');
    const requestString = req.outRequest();

    chai.expect(requestString).to.deep.equal(expectedReq);
  });
  it('POST request for provided URL. Multipart/form-data', () => {
    throw Error('Multipart form data not supported currently. Test is empty.');
  });
});
