import Encodings from '../src/enums/encodings';

interface StringKeyStringValue {
  [key: string]: string | undefined,
}

export interface AnyHeaders extends StringKeyStringValue {}

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
