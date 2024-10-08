import { boolean, lazy, number, object, ObjectSchema, string } from "yup";

export const DEFAULT_STRING = "default";
export const DEFAULT_NUMBER = 99;
export const DEFAULT_BOOLEAN = true;
export const DEFAULT_NESTED_OBJECT: NestedObject = {
    nestedRequiredField: "nested default",
    nestedOptionalField: null,
    nestedStringField: "nested default",
    nestedNumberField: 99_99,
    nestedBooleanField: true,
};
export const DEFAULT_TEST_OBJECT: TestSchema = {
    requiredField: DEFAULT_STRING,
    optionalField: null,
    stringField: DEFAULT_STRING,
    numberField: DEFAULT_NUMBER,
    booleanField: DEFAULT_BOOLEAN,
    nestedObjectField: DEFAULT_NESTED_OBJECT,
    lazyObjectField: DEFAULT_NESTED_OBJECT,
    lazyStringField: DEFAULT_STRING,
    lazyNumberField: DEFAULT_NUMBER,
    lazyBooleanField: DEFAULT_BOOLEAN,
};

export const nestedObjectSchema: ObjectSchema<NestedObject> = object({
    nestedRequiredField: string().required().default(DEFAULT_NESTED_OBJECT.nestedRequiredField),
    nestedOptionalField: string().notRequired(),
    nestedStringField: string().default(DEFAULT_NESTED_OBJECT.nestedStringField),
    nestedNumberField: number().default(DEFAULT_NESTED_OBJECT.nestedNumberField),
    nestedBooleanField: boolean().default(DEFAULT_NESTED_OBJECT.nestedBooleanField),
});

export const testSchema: ObjectSchema<TestSchema> = object({
    requiredField: string().required().default(DEFAULT_STRING),
    optionalField: string().notRequired(),
    stringField: string().default(DEFAULT_STRING),
    numberField: number().default(DEFAULT_NUMBER),
    booleanField: boolean().default(DEFAULT_BOOLEAN),
    nestedObjectField: nestedObjectSchema.default(DEFAULT_NESTED_OBJECT),
    lazyObjectField: lazy(() => nestedObjectSchema.default(null)),
    lazyStringField: lazy(() => string().default(DEFAULT_STRING)),
    lazyNumberField: lazy(() => number().default(DEFAULT_NUMBER)),
    lazyBooleanField: lazy(() => boolean().default(DEFAULT_BOOLEAN)),
});
