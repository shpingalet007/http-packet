import RequestMethods from '../HttpPacket/src/enums/methods';
import { AnyHeaders } from './headers';
import HttpVersions from '../HttpPacket/src/enums/httpVersions';
import {
  ApplicationJsonBody, FormDataBody, TextPlainBody, UrlencodedBody,
} from './types';

type GenerateFunctionArgs = 'buffer' | 'string';

type TypeStringBuffer = Uint8Array | string;

interface HttpRequestParameters {
  url: string,
  method?: RequestMethods,
  queryParams?: object,
  headers?: AnyHeaders,
  body?: ApplicationJsonBody | FormDataBody | UrlencodedBody | TextPlainBody,
  version?: HttpVersions
}

interface HttpPacketData {
  headers: AnyHeaders,
}

interface HttpRequestData extends HttpPacketData {
  url: string,
  version: HttpVersions,
  method: RequestMethods,
  queryParams: object,
  body?: ApplicationJsonBody | FormDataBody | UrlencodedBody | TextPlainBody,
}

interface HttpResponseData extends HttpPacketData {
  version: string
  status: {
    code: number,
    description: string,
  },
  body: string,
}
