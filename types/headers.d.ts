import Encodings from '../HttpPacket/src/enums/encodings';
import { StringKeyStringValue } from './types';

interface AnyRequestHeaders extends StringKeyStringValue {}

interface RequestHeaders extends AnyRequestHeaders {
  Host: string,
  ContentType?: Encodings,
}
