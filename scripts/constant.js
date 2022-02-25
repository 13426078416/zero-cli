const organizationName = "zero-cli";
process.env.ORGANIZATION_NAME = organizationName;
const organizationZeroName = "zero-cli";
process.env.ORGANIZATION_ZERO_NAME = organizationZeroName;

// cli-utils-shared weight: 11
// cli weight: 10
// cli-service-plugin weight: 9
// ...other packages weight: < 9
const PACKAGE_WEIGHT_LIST = {
  "cli-types-shared": 13,
  "cli-utils-shared": 12,
  cli: 10,
  "cli-service-plugin": 9,
};

module.exports = {
  organizationName,
  organizationZeroName,
  PACKAGE_WEIGHT_LIST,
};
