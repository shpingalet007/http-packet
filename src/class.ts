import parseUrl from 'parseuri';
import QueryString from 'query-string';
import matchAll from './libs/RegexMatchAll';

import { RequestHeaders, StringKeyStringValue } from '../types/headers';

import HttpVersions from './enums/httpVersions';
import RequestMethods from './enums/methods';
import Encodings from './enums/encodings';
import {
  GenerateFunctionArgs,
  HttpRequestParameters,
  HttpResponseData,
  TypeStringBuffer,
} from '../types/arguments';

const { parseUrl: parseQuery } = QueryString;

class HttpPacket {
  Static = HttpPacket;

  version: string = HttpVersions.v1_1;

  host: string = 'NULL_HOST';

  path: string = 'NULL_PATH';

  method: string = RequestMethods.Get;

  encoding: Encodings = Encodings.TextPlain;

  query: object = {};

  headers: RequestHeaders;

  body?: object | string;

  constructor({
    version,
    method,
    url,
    queryParams,
    headers,
    body,
  }: HttpRequestParameters) {
    const linkParsed = parseQuery(url);

    const urlQuery = linkParsed.query;
    const urlParsed = parseUrl(linkParsed.url);

    // Version parameter
    if (version) {
      this.version = version;
    }

    // Populating METHOD
    if (method) {
      this.method = method;
    }

    // Populating HOST and PATH
    this.host = urlParsed.host;
    this.path = urlParsed.path || '/';

    // Populating QUERY object
    Object.assign(this.query, {
      ...urlQuery,
      ...queryParams,
    });

    // Populating ENCODING and BODY
    if (typeof body === 'object') {
      this.encoding = body.encoding;
      this.body = body.content;
    }

    // Populating HEADERS object
    this.headers = { Host: this.host };

    if (this.body) {
      this.headers.ContentType = this.encoding;
    }

    this.headers = Object.assign(this.headers, headers);
  }

  #outRequestLine = (): string => {
    const {
      method,
      path,
      query,
      version,
    } = this;

    const isQueryParamsEmpty = (Object.keys(query).length);
    const stringQueryParams = (isQueryParamsEmpty)
      ? `?${this.#urlencodeParameters(query)}`
      : '';

    const methodUpCase = method.toUpperCase();
    const pathAndQuery = `${path}${stringQueryParams}`;
    const httpVersion = `HTTP/${version}`;

    return `${methodUpCase} ${pathAndQuery} ${httpVersion}`;
  };

  #outHeaders = (): Array<string> => {
    const { headers } = this;

    const headerNames = Object.keys(headers);
    const headersArray: Array<string> = [];

    headerNames.forEach((camelHeaderName) => {
      const HeaderName = this.#convertHeaderName(camelHeaderName);
      const HeaderValue = headers[camelHeaderName];

      headersArray.push(`${HeaderName}: ${HeaderValue}`);
    });

    return headersArray;
  };

  #convertHeaderName = (camelHeaderName: string): string => {
    const CapitalSeparator = /([A-Z][a-z]+)/g;

    const headersParts = <RegExpMatchArray> camelHeaderName.match(CapitalSeparator);

    return headersParts.join('-');
  };

  #urlencodeParameters = (obj: object): string => {
    const keys = Object.keys(obj);
    const values = Object.values(obj);

    let urlencoded = Object.values(keys);

    urlencoded = urlencoded.map((key: string, i) => {
      const value = values[i];

      return `${key}=${value}`;
    });

    return urlencoded.join('&');
  };

  #encodeBody = (): string => {
    const { encoding, body = '' } = this;

    let encodedBody: string;

    switch (encoding) {
      case Encodings.FormData:
        throw Error('FormData currently not supported');
      case Encodings.FormUrlencoded:
        encodedBody = this.#urlencodeParameters(<object> body);
        break;
      case Encodings.Json:
        encodedBody = JSON.stringify(<object> body);
        break;
      case Encodings.TextPlain:
        encodedBody = <string> body;
        break;
      default:
        throw Error(`Unsupported body content encoding ${encoding}`);
    }

    return encodedBody;
  };

  private static convertStringToBytes = (strReq: string): Uint8Array => {
    const array = strReq
      .split('')
      .map((letter) => (
        letter.charCodeAt(0)
      ));

    return Uint8Array.from(array);
  };

  private static convertBytesToString = (bytesRes: Uint8Array): string => {
    let str = '';
    bytesRes.forEach((byte) => {
      str += String.fromCharCode(byte);
    });

    return str;
  };

  generate(type: GenerateFunctionArgs = 'string'): TypeStringBuffer {
    const ReqLine = this.#outRequestLine();
    const Headers = this.#outHeaders();

    const Body = this.#encodeBody();

    if (Body.length) {
      Headers.push(`Content-Length: ${Body.length}`);
    }

    const merged = [
      ReqLine,
      ...Headers,
      `\n${Body}`,
    ];

    const strRequest = merged.join('\n');

    if (type === 'buffer') {
      return this.Static.convertStringToBytes(strRequest);
    }

    return strRequest;
  }

  static parse(request: TypeStringBuffer): HttpResponseData {
    const Static = HttpPacket;

    // Assume that is string
    let strReq = request;

    // Checking if is something else than string
    if (typeof request !== 'string') {
      strReq = Static.convertBytesToString(request);
    }

    const parts = (<string> strReq).split(/\n{2}/mg);
    const head = parts.splice(0, 1)[0];
    const content = parts.join('\n\n');

    const regexResLine = /HTTP\/(?<httpVersion>\d\.\d)\s(?<statusCode>\d+)\s(?<statusDescription>.*)/mg;
    const regexHeader = /(?<name>.*):\s(?<value>.*)/m;
    // const regexBody = /\n{2}(.?\n?)*/mg;

    const resLine = regexResLine.exec(<string> head).groups;

    const headers: StringKeyStringValue = {};

    matchAll(regexHeader, <string> head)
      .forEach((match) => {
        const headerName = match.groups.name;

        headers[headerName] = match.groups.value;
      });

    const body = content;

    return {
      version: resLine.httpVersion,
      status: {
        code: Number.parseInt(resLine.statusCode, 10),
        description: resLine.statusDescription,
      },
      headers,
      body,
    };
  }
}

export default HttpPacket;
