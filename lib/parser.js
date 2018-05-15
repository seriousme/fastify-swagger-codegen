// this class is to bridge various parser versions
const swp = require("swagger-parser");
const ParserV2 = require("./parser.v2");
// const ParserV3 = require("./parser.v3");  // once available, for now only v2

class parser {
  /** constructor */
  constructor() {
    return this;
  }

  /**
   * get the original specification as object
   * @returns {object}
   */
  specification() {
    return this.original;
  }

  /**
   * parse a swagger specification
   * @param {string|object} specification Filename of JSON/YAML file or object containing a swagger specification
   * @returns {object} fastify configuration information
   */
  async parse(specification) {
    let swagger, data;
    try {
      // parse first, to avoid dereferencing of $ref's
      data = await swp.parse(specification);
      // save the original (with $refs) because swp.validate modifies its input
      this.original = JSON.parse(JSON.stringify(data, null, 2));
      // and validate
      swagger = await swp.validate(data);
    } catch (e) {
      data = {};
      swagger = {};
    }

    const version = swagger.swagger;

    switch (version) {
      case "2.0":
        const parserV2 = new ParserV2();
        return parserV2.parse(swagger);

      // case "3.0":
      // const parserV3 = new ParserV3();
      // return parserV3.parse(swagger);
      // break;

      default:
        throw new Error(
          "'swaggerSpec' parameter must contain a swagger version 2.0 specification"
        );
    }
  }
}

module.exports = config => new parser(config);
