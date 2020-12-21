import Encodings from '../HttpPacket/src/enums/encodings';

interface StringKeyStringValue {
  [key: string]: string | undefined,
}

interface AnyHeaders extends StringKeyStringValue {}

interface RequestHeaders extends AnyHeaders {
  Host: string,
  ContentType?: Encodings,
}

interface ResponseHeaders extends AnyHeaders {
  Date: string,
  Server: string,
  ContentLength: string,
  ContentType?: string,
}
