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

export declare const createEnvConfig: <T extends EnvVariablesConfiguration>(props: {
  variables: T;
  groups: EnvConfig<T>['groups'];
}) => EnvConfig<T>;

export declare const createZodSchemaFromEnvConfig: <T extends EnvVariablesConfiguration>(
  envConfig: EnvConfig<T>,
) => ReturnType<ZodSchemaType<T>['superRefine']>;
