const { config } = require('process');
const { z } = require('zod');

// Returns an environment config
const createEnvConfig = (props) => {
  return { groups: props.groups, variables: props.variables };
};

// Creates a zod schema (z.Object({...})) based on an environment configuration
const createZodSchemaFromEnvConfig = (config) => {
  const zodSchema = {};

  Object.keys(config.variables).map((variable) => {
    const key = variable;
    const variableConfig = config.variables[key];
    const defaultRule = variableConfig.defaultRule;
    zodSchema[variable] = defaultRule;
  });

  return z.object(zodSchema);
};

// Adds stage (build/lint/...) specific environment variable validation to a zod schema
const addVariableValidation = (schema, envConfig) => {
  const valueExists = (value) => value?.toString().trim().length > 0;

  return schema.superRefine((values, ctx) => {
    const configKeys = Object.keys(envConfig.variables);
    const currentStage = values.STAGE; // lint/build/production/...

    // Validate single environment variables one-by-one
    configKeys.forEach((configKey) => {
      const variableConfig = envConfig.variables[configKey];

      // Check if env variable should be checked at this stage
      const stagesApplies = variableConfig.stages?.some((stage) => stage === currentStage) ?? true;

      if (!stagesApplies) {
        return;
      }

      const value = values[configKey];
      const valueIsSet = valueExists(value);

      // Optional env variables may be omitted
      if (!variableConfig.required && !valueIsSet) {
        return;
      }

      // Check that required env variables are set
      if (!valueIsSet) {
        ctx.addIssue({
          message: `Environment variable '${String(configKey)}' is required, but not set`,
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      // Check env variable against regex if configured
      if (!variableConfig.regex) {
        return;
      }

      const matchesRegex = variableConfig.regex.test(value);

      if (!matchesRegex) {
        ctx.addIssue({
          message: `Environment variable '${String(configKey)}' has an invalid format`,
          code: z.ZodIssueCode.custom,
        });
      }
    });

    // Validate env variable groups
    envConfig.groups.forEach((group) => {
      // Check if env variable group should be checked at this stage
      const stageApplies = group.stages?.some((stage) => stage === currentStage) ?? true;

      if (!stageApplies) {
        return;
      }

      const groupValues = group.variables.map((variable) => values[variable]);
      const noneAreSet = groupValues.every((value) => !valueExists(value));

      if (group.mode === 'at_least_one' && noneAreSet) {
        ctx.addIssue({ message: group.errorMessage, code: z.ZodIssueCode.custom });
        return;
      }

      const someAreSet = !noneAreSet;
      const someAreNotSet = groupValues.some((value) => !valueExists(value));

      if (group.mode === 'none_or_all' && someAreSet && someAreNotSet) {
        ctx.addIssue({ message: group.errorMessage, code: z.ZodIssueCode.custom });
        return;
      }
    });
  });
};

const createValidatingZodSchemaFromEnvConfig = (envConfig) => {
  const zodSchema = createZodSchemaFromEnvConfig(envConfig);
  const validatingZodSchema = addVariableValidation(zodSchema, envConfig);
  return validatingZodSchema;
};

module.exports = {
  createEnvConfig,
  createZodSchemaFromEnvConfig: createValidatingZodSchemaFromEnvConfig,
};
