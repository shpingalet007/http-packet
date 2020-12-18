import parseUrl from 'parseuri';
import QueryString from 'query-string';

import { HttpPacketConstructorArgs } from '../../types/arguments';
import { RequestHeaders } from '../../types/headers';

import HttpVersions from './enums/httpVersions';
import RequestMethods from './enums/methods';
import Encodings from './enums/encodings';

const { parseUrl: parseQuery } = QueryString;

class HttpPacket {
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
  }: HttpPacketConstructorArgs) {
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

    const isUrlQueryEmpty = (
      Object.keys(urlQuery).length === 0
      || Object.keys(queryParams).length === 0
    );

    // Populating QUERY object
    if (!isUrlQueryEmpty) {
      Object.assign(this.query, {
        ...urlQuery,
        ...queryParams,
      });
    }

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

  outRequest(): string {
    const ReqLine = this.#outRequestLine();
    const Headers = this.#outHeaders();

    const Body = this.#encodeBody();

    const merged = [
      ReqLine,
      ...Headers,
      `\n${Body}`,
    ];

    return merged.join('\n');
  }
}

export default HttpPacket;
