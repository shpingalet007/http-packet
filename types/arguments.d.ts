import { AnyRequestHeaders } from './headers';
import RequestMethods from '../HttpPacket/src/enums/methods';
import HttpVersions from '../HttpPacket/src/enums/httpVersions';
import {
  ApplicationJsonBody,
  FormDataBody,
  TextPlainBody,
  UrlencodedBody,
} from './types';

type HttpPacketConstructorArgs = {
  url: string,
  method?: RequestMethods,
  queryParams?: object,
  headers?: AnyRequestHeaders,
  body?: ApplicationJsonBody | FormDataBody | UrlencodedBody | TextPlainBody,
  version?: HttpVersions
};
