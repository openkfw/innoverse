import { z } from 'zod';

type EnvConfig<T extends EnvVariablesConfiguration> = {
  variables: T;
  groups: EnvVariableGroupConfiguration<T>[];
};

// Environment variable specific configuration
type EnvVariablesConfiguration = {
  [key: string]: {
    defaultRule: z.ZodTypeAny;
    required?: boolean;
    stages?: ('development' | 'test' | 'build' | 'production' | 'lint')[];
    regex?: RegExp;
  };
};

// Configurations for a collection of environment variables
type EnvVariableGroupConfiguration<T> = {
  variables: (keyof T)[];
  mode: 'none_or_all' | 'at_least_one';
  stages?: ('development' | 'test' | 'build' | 'production' | 'lint')[];
  errorMessage: string;
};

// Zod schema that is created based on a environment config
type ZodSchemaType<TVariables extends EnvVariablesConfiguration> = z.ZodObject<{
  [K in keyof TVariables]: TVariables[K]['defaultRule'];
}>;

// Returns an environment config
export const createEnvConfig = <T extends EnvVariablesConfiguration>(props: {
  variables: T;
  groups: EnvConfig<T>['groups'];
}) => {
  return { groups: props.groups, variables: props.variables };
};

export const createValidatingZodSchemaFromEnvConfig = <TVariables extends EnvVariablesConfiguration>(
  envConfig: EnvConfig<TVariables>,
): ReturnType<ZodSchemaType<TVariables>['superRefine']> => {
  const zodSchema = createZodSchemaFromEnvConfig(envConfig);
  const validatingZodSchema = addVariableValidation(zodSchema, envConfig);
  return validatingZodSchema;
};

// Creates a zod schema (z.Object({...})) based on an environment configuration
const createZodSchemaFromEnvConfig = <TVariables extends EnvVariablesConfiguration>(config: EnvConfig<TVariables>) => {
  const zodSchema: { [key: string]: z.ZodTypeAny } = {};

  Object.keys(config.variables).map((variable) => {
    const key = variable as keyof TVariables;
    const variableConfig = config.variables[key];
    const defaultRule = variableConfig.defaultRule;
    zodSchema[variable] = defaultRule;
  });

  return z.object(zodSchema) as ZodSchemaType<TVariables>;
};

// Adds stage (build/lint/...) specific environment variable validation to a zod schema
const addVariableValidation = <TVariables extends EnvVariablesConfiguration>(
  schema: ZodSchemaType<TVariables>,
  envConfig: EnvConfig<TVariables>,
) => {
  const valueExists = (value: string | undefined) => (value?.toString().trim().length ?? 0) > 0;

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
          path: [configKey],
          fatal: variableConfig.required,
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
          path: [configKey],
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
      const variableNames = group.variables.map((envVariable) => envVariable) as string[];

      if (group.mode === 'at_least_one' && noneAreSet) {
        ctx.addIssue({ message: group.errorMessage, code: z.ZodIssueCode.custom, path: variableNames });
        return;
      }

      const someAreSet = !noneAreSet;
      const someAreNotSet = groupValues.some((value) => !valueExists(value));

      if (group.mode === 'none_or_all' && someAreSet && someAreNotSet) {
        ctx.addIssue({ message: group.errorMessage, code: z.ZodIssueCode.custom, path: variableNames });
        return;
      }
    });
  });
};
