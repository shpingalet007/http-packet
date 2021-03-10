import { RequestHeaders } from '../types/headers';
import Encodings from './enums/encodings';
import { GenerateFunctionArgs, HttpRequestParameters, HttpResponseData, TypeStringBuffer } from '../types/arguments';
declare class HttpPacket {
    #private;
    Static: typeof HttpPacket;
    version: string;
    host: string;
    path: string;
    method: string;
    encoding: Encodings;
    query: object;
    headers: RequestHeaders;
    body?: object | string;
    constructor({ version, method, url, queryParams, headers, body, }: HttpRequestParameters);
    private static convertStringToBytes;
    private static convertBytesToString;
    generate(type?: GenerateFunctionArgs): TypeStringBuffer;
    static parse(request: TypeStringBuffer): HttpResponseData;
}
export default HttpPacket;
