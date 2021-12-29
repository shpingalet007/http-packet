# http-packet

[![Build Status](https://travis-ci.com/Shpingalet007/http-packet.svg?branch=main)](https://travis-ci.com/Shpingalet007/http-packet)  
[![Coverage Status](https://coveralls.io/repos/github/Shpingalet007/http-packet/badge.svg?branch=main)](https://coveralls.io/github/Shpingalet007/http-packet?branch=main)

HTTP crossplatform request generator. It allows generating and parsing HTTP 1.1 requests. May be used with net.Socket or any other transport. Working on browser and node.

## How to use
### Creating instance
First, we need create HttpPacket instance.

    // Use import HttpPacket from '@shpingalet007/http-packet';
    // or const HttpPacket = require('@shpingalet007/http-packet');
    
    const httpPacket = new HttpPacket(/* params object */);
HttpPacket supports more options to be passed in constructor, but they would be described further. The only mandatory param is **url**.

What we need to know is that there are default params set:

    version: '1.1' | HttpVersions.v1_1              // Currently stable on HTTP 1.1
    method: 'get' | RequestMethods.Get              // HTTP Method GET
    encoding: 'text/plain' | Encodings.TextPlain    // Text plain

### Generating HTTP request
#### Example 1: Simple GET request
The library can produce HTTP requests as string or as Uint8Array binary.

    const httpPacket = new HttpPacket({ url: 'http://example.net/' });
    const httpRequest = httpPacket.generate('string');

This will produce GET request to http://example.net/ :

    GET / HTTP/1.1\r\n
    Host: example.net\r\n
    \r\n

#### Example 2: GET request with query params
We can specify query params with constructor setting **queryParams**, or they might be decoded from **url** setting if there are any.

    const httpPacket = new HttpPacket({
      url: 'http://example.net/',
      queryParams: { testParam: 'This is just a test' }
    });
    const httpRequest = httpPacket.generate('string');
All **queryParams** would be urlencoded automatically. And as a result, we get next request:

	GET /?testParam=This%20is%20just%20a%20test HTTP/1.1\r\n
	Host: example.net\r\n
	\r\n
#### Example 3: POST request with data in body
In this example we would change the HTTP method and set some data in body

    const httpPacket = new HttpPacket({
      method: 'POST',
      url: 'http://example.net/',
      body: {  
	    encoding: /* 'application/json' || Encodings.Json, */
	    content: { testParam: 'This is just a test' }
	  }
    });
    const httpRequest = httpPacket.generate('string');

And we get next request:

    POST / HTTP/1.1\r\n
    Host: example.net\r\n
    Content-Type: application/json\r\n
    Content-Length: 35\r\n
    \r\n
    {"testParam":"This is just a test"}
#### Example 4: Complex request
Alright, here we would make a conclusion creating complex request with all settings available in HttpPacket library.

	const httpPacket = new HttpPacket({  
	  version: HttpVersions.v2_0,  
	  authentication: {  
	    type: AuthTypes.Basic,  
	    credentials: { username: 'admin', password: '0000' },  
	  },  
	  method: RequestMethods.Post,  
	  url: 'http://example.net/',  
	  queryParams: {  
	    q1: 'test',  
	  },  
	  headers: {  
	    // 'X-Application': 'Browser',  
	    xApplication: 'Browser', // This will result in 'X-Application' header
	    _xApplication: 'Browser', // This will result in 'xApplication' header
	  },  
	  body: {  
	    encoding: Encodings.FormUrlencoded,  
	    content: {  
	      a: '100',  
	      b: '200',  
	    },  
	  },  
	});

Resulting in next packet:

	POST /?q1=test HTTP/2.0\r\n
	Host: example.net\r\n
	Content-Type: application/x-www-form-urlencoded\r\n
	X-Application: Browser\r\n
	xApplication: Test header\r\n
	Authorization: Basic YWRtaW46MDAwMA==\r\n
	Content-Length: 11\r\n
	\r\n
	a=100&b=200

### HttpPacket settings
Settings are passed on instance construction. Full list is next:

    version: typeof HttpVersions (default: HttpVersions.v1_1)
    authentication: AuthBasic | AuthBearer (default: null)
	method: typeof RequestMethods (default: RequestMethods.Get)
	url: string, (mandatory param)
	queryParams: object, (default: null)
	headers: object, (default: null)
	body: ApplicationJsonBody | FormDataBody | UrlencodedBody | TextPlainBody
