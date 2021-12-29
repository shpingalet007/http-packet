import chai from 'chai';
import HttpPacket from '../../src/class';

describe('Parsing response', () => {
  it('Parsing from string', () => {
    const httpRes = [
      'HTTP/1.1 404 Not Found',
      'Date: Sun, 18 Oct 2012 10:36:20 GMT',
      'Server: Apache/2.2.14 (Win32)',
      'Content-Length: 230',
      'Connection: Closed',
      'Content-Type: text/html; charset=iso-8859-1',
      '\n{ json: true }',
      '\n{ json: true }',
    ].join('\n');

    const expectedObj = {
      body: '{ json: true }\n\n{ json: true }',
      headers: {
        'Connection': 'Closed',
        'Content-Length': '230',
        'Content-Type': 'text/html; charset=iso-8859-1',
        'Date': 'Sun, 18 Oct 2012 10:36:20 GMT',
        'Server': 'Apache/2.2.14 (Win32)',
      },
      status: {
        code: 404,
        description: 'Not Found',
      },
      version: '1.1',
    };

    const resObj = HttpPacket.parse(httpRes);

    chai.expect(resObj).to.deep.equal(expectedObj);
  });
  it('Parsing from bytes', () => {
    const httpRes = [
      'HTTP/1.1 404 Not Found',
      'Date: Sun, 18 Oct 2012 10:36:20 GMT',
      'Server: Apache/2.2.14 (Win32)',
      'Content-Length: 230',
      'Connection: Closed',
      'Content-Type: text/html; charset=iso-8859-1',
      '\n{ json: true }',
      '\n{ json: true }',
    ].join('\n');

    // @ts-ignore
    const httpResBytes = HttpPacket.convertStringToBytes(httpRes);

    const expectedObj = {
      body: '{ json: true }\n\n{ json: true }',
      headers: {
        'Connection': 'Closed',
        'Content-Length': '230',
        'Content-Type': 'text/html; charset=iso-8859-1',
        'Date': 'Sun, 18 Oct 2012 10:36:20 GMT',
        'Server': 'Apache/2.2.14 (Win32)',
      },
      status: {
        code: 404,
        description: 'Not Found',
      },
      version: '1.1',
    };

    const resObj = HttpPacket.parse(httpResBytes);

    chai.expect(resObj).to.deep.equal(expectedObj);
  });
  it('', () => {
    const httpRes = 'HTTP/1.1 200 OK\n' +
        'Server: Cowboy\n' +
        'Connection: close\n' +
        'Content-Type: application/json\n' +
        'Vary: Origin\n' +
        'Date: Thu, 01 Apr 2021 11:50:26 GMT\n' +
        'Content-Length: 22\n' +
        'Via: 1.1 vegur\n' +
        '\n' +
        '{"ip":"156.146.62.52"}';

    console.log(HttpPacket.parse(httpRes));
  });
});
