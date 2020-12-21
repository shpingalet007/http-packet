import RequestMethods from "../HttpPacket/src/enums/methods";
import {AnyRequestHeaders} from "./headers";
import HttpVersions from "../HttpPacket/src/enums/httpVersions";
import {ApplicationJsonBody, FormDataBody, TextPlainBody, UrlencodedBody} from "./types";

type GenerateFunctionArgs = 'buffer' | 'string';

type TypeStringBuffer = Uint8Array | string;

interface HttpRequestParameters {
  url: string,
  method?: RequestMethods,
  queryParams?: object,
  headers?: AnyRequestHeaders,
  body?: ApplicationJsonBody | FormDataBody | UrlencodedBody | TextPlainBody,
  version?: HttpVersions
}

interface HttpPacketData {
  version: HttpVersions,
  headers: AnyRequestHeaders,
  body?: ApplicationJsonBody | FormDataBody | UrlencodedBody | TextPlainBody,
}

interface HttpRequestData extends HttpPacketData {
  url: string,
  method: RequestMethods,
  queryParams: object,
}

interface HttpResponseData extends HttpPacketData {
  version: string
  status: {
    code: number,
    description: string,
  },
  body: string,
}
