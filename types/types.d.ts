import Encodings from '../HttpPacket/src/enums/encodings';
import RequestMethods from "../HttpPacket/src/enums/methods";
import { AnyRequestHeaders } from "./headers";
import HttpVersions from "../HttpPacket/src/enums/httpVersions";

interface StringKeyStringValue {
  [key: string]: string | undefined,
}

interface FormData {
  encoding: Encodings,
  content: object | string,
}

interface ApplicationJsonBody extends FormData {
  encoding: Encodings.Json,
  content: object,
}

interface FormDataBody extends FormData {
  encoding: Encodings.FormData,
  content: object,
}

interface UrlencodedBody extends FormData {
  encoding: Encodings.FormUrlencoded,
  content: object,
}

interface TextPlainBody extends FormData {
  encoding: Encodings.TextPlain,
  content: string,
}
