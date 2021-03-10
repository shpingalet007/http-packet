/**
 * Custom declaration of types for NPM parseuri
 */

interface parsedUrl {
  anchor: string,
  query: string,
  file: string,
  directory: string,
  path: string,
  relative: string,
  port: string,
  host: string,
  password: string,
  user: string,
  userInfo: string,
  authority: string,
  protocol: string,
  source: string,
  pathNames: string[],
  queryKey: object,
}

declare module 'parseuri' {
  function parseuri(uri: string): parsedUrl;

  export = parseuri;
}
