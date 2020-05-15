# Fastify swagger generator
[![Build Status](https://travis-ci.org/seriousme/fastify-swaggergen.svg?branch=master)](https://travis-ci.org/seriousme/fastify-swaggergen)


A plugin for [fastify](https://www.fastify.io) to autogenerate a configuration based on a [OpenApi](https://www.openapis.org/)(v2/v3) specification.


----
# This project has been replaced by [Fastify OpenApi Glue](https://github.com/seriousme/fastify-openapi-glue)

----

<a name="install"></a>
## Install: 
```
npm i fastify-swaggergen --save
```
<a name="plugin"></a>
## Plugin
<a name="pluginUsage"></a>
### Usage

Add the plugin to your project with `register` and pass it some basic options and you are done !
```javascript
const swaggerGen = require("fastify-swaggergen");

const options = {
  swaggerSpec: `${__dirname}/petstore-swagger.v2.json`,
  service: `${__dirname}/service.js`,
  fastifySwagger: {
    disabled: false
  }
};


fastify.register(swaggerGen, options);
```

All schema and routes will be taken from the OpenApi specification listed in the options. No need to specify them in your code. 
<a name="pluginOptions"></a>
### Options
  - `swaggerSpec`: this can be a JSON object, or the name of a JSON or YAML file containing a valid OpenApi(v2/v3) file 
  - `service`: this can be a javascript object or class, or the name of a javascript file containing such an object. If the import of the file results in a function instead of an object then the function will be executed during import.
  - `fastifySwagger`: an object containing the options for the [fastify-swagger](https://github.com/fastify/fastify-swagger) plugin. To avoid registering this plugin pass `{ fastifySwagger: { disabled: true }}`

Of these options `swaggerSpec` and `service` are mandatory, `fastifySwagger` is optional.

See the [examples](#examples) section for a demo.
<a name="generator"></a>
## Generator

To make life even more easy there is the `swaggergen` cli. The `swaggergen` cli takes a valid OpenApi (v2/v3) file (JSON or YAML) and generates a project including a fastify flugin that you can use on any fastify server, a stub of the service class and a skeleton of a test harness to test the plugin. 

<a name="generatorUsage"></a>
### Usage
```
  swaggergen [options] <OpenApi specification>
```
or if you don't have `swaggergen` installed:
```
  npx github:seriousme/fastify-swaggergen <OpenApi specification>
```
This will generate a project based on the provided OpenApi specification.
Any existing files in the project folder will be overwritten!
See the [generator examples](#examples) section for a demo.
<a name="generatorOptions"></a>
### Options:
```

  -p <name>                   The name of the project to generate
  --projectName=<name>        [default: generatedProject]

  -b <dir> --baseDir=<dir>    Directory to generate the project in.
                              This directory must already exist.
                              [default: "."]

The following options are only usefull for testing the swaggergen plugin:
  -c --checksumOnly           Don't generate the project on disk but
                              return checksums only.
  -l --localPlugin            Use a local path to the plugin.
```
See the [generator example](#generatorExamples) section for a demo.

<a name="examples"></a>
## Examples
Clone this repository and run `npm i` 

<a name="pluginExamples"></a>
### Plugin
Executing `npm start` will start fastify on localhost port 3000 with the
routes extracted from the [petstore example](examples/petstore/petstore-swagger.v2.json) and the [accompanying service definition](examples/petstore/service.js)

* http://localhost:3000/documentation will show the swagger UI, for comparison one could look
  at http://petstore.swagger.io/
* http://localhost:3000/v2/pet/24 will return a pet as specified in service.js
* http://localhost:3000/v2/pet/myPet will return a fastify validation error:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "params.petId should be integer"
}
```

* http://localhost:3000/v2/pet/findByStatus?status=a&status=b will return
  the following error:

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Operation findPetsByStatus not implemented"
}
```

* http://localhost:3000/v2/pet/0 will return the following error:

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "name is required!"
}
```

as the pet returned by service.js does not match the response schema.

<a name="generatorExamples"></a>
### Generator
The folder [examples/generatedProject](examples/generatedProject) contains the result of running `swaggergen -l --baseDir=examples examples/petstore/petstore-swagger.v2.yaml`. The generated code can be started using `npm start` in `examples/generatedProject` (you will need to run `npm i` in the generated folder first)
<a name="license"></a>


# License
Licensed under [MIT](license.txt)
