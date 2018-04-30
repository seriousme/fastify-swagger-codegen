# Fastify swagger code generator

This repository contains an experiment to see if its possible to take a swagger file (v2) and autogenerate a configuration for [fastify](https://www.fastify.io).

The result is quite simple:

* [index.js](index.js) loads the swagger file, feeds it to the [parser](parserv2.js) and uses the result to generate the routes.

* The `definitions` section of the swagger specification is loaded in AJV to be able to resolve `$ref` schema references. AJV itself misses some format handlers so [ajv-oai](https://www.npmjs.com/package/ajv-oai) is being used as it adds the missing OpenApi formats.

* For each route the parser has determined an `operationId`, either taken from the swagger definition or generated by the parser.

* The `Service` class in [service.js](service.js) holds the implementation of the service (e.g. the business logic). When generating the routes the service class is checked for methods with the same name as the `operationId` which are then attached as handler. When not available, a "not implemented" handler is attached to the route.

* [generator.js](generator.js) can be used to generate the `Service` class. The generator can be extended to add information about parameters, information in comments etc.

* [fastify-swagger](https://github.com/fastify/fastify-swagger) has been included to do a round trip. The swagger UI shows on `/documentation` but the operations fail due to the handling of `basePath` in fastify-swagger.

## Examples

Clone this repository and run `npm i`
Executing `node index.js` will then start fastify on port 3000 with the routes extracted from the [petstore example](examples/petstore-swagger.v2.json)

* http://localhost:3000/v2/pet/24 will return a pet as specified in service.js
* http://localhost:3000/v2/pet/myPet will return a fastify validation error:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "params.petId should be integer"
}
```

* http://localhost:3000/v2/pet/findByStatus?status=a&status=b will return the following error:

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Operation findPetsByStatus not implemented"
}
```
