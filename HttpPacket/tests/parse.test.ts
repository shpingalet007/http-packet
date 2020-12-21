import chai from 'chai';
import HttpPacket from '../src/class';
import HttpVersions from '../src/enums/httpVersions';
import RequestMethods from '../src/enums/methods';
import Encodings from '../src/enums/encodings';

describe('Parse request', () => {
  it('Parsing', () => {
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
        Connection: 'Closed',
        'Content-Length': '230',
        'Content-Type': 'text/html; charset=iso-8859-1',
        Date: 'Sun, 18 Oct 2012 10:36:20 GMT',
        Server: 'Apache/2.2.14 (Win32)',
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
});
