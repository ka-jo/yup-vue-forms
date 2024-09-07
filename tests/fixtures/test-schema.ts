import { boolean, lazy, number, object, ObjectSchema, string } from "yup";

export const DEFAULT_STRING = "default";
export const DEFAULT_NUMBER = 99;
export const DEFAULT_BOOLEAN = true;
export const DEFAULT_OBJECT = {
    nestedRequiredField: "nested default",
    nestedOptionalField: null,
    nestedStringField: "nested default",
    nestedNumberField: 99_99,
    nestedBooleanField: true,
} as NestedObject;

export type TestSchema = {
    requiredField: string;
    optionalField?: string | null;
    stringField: string;
    numberField: number;
    booleanField: boolean;
    nestedObjectField: NestedObject;
    lazyObjectField: NestedObject | null;
    lazyStringField: string;
    lazyNumberField: number;
    lazyBooleanField: boolean;
};

export type NestedObject = {
    nestedRequiredField: string;
    nestedOptionalField?: string | null;
    nestedStringField: string;
    nestedNumberField: number;
    nestedBooleanField: boolean;
};

export const nestedObjectSchema: ObjectSchema<NestedObject> = object({
    nestedRequiredField: string().required().default(DEFAULT_OBJECT.nestedRequiredField),
    nestedOptionalField: string().notRequired(),
    nestedStringField: string().default(DEFAULT_OBJECT.nestedStringField),
    nestedNumberField: number().default(DEFAULT_OBJECT.nestedNumberField),
    nestedBooleanField: boolean().default(DEFAULT_OBJECT.nestedBooleanField),
});

export const testSchema: ObjectSchema<TestSchema> = object({
    requiredField: string().required().default(DEFAULT_STRING),
    optionalField: string().notRequired(),
    stringField: string().default(DEFAULT_STRING),
    numberField: number().default(DEFAULT_NUMBER),
    booleanField: boolean().default(DEFAULT_BOOLEAN),
    nestedObjectField: nestedObjectSchema.default(DEFAULT_OBJECT),
    lazyObjectField: lazy(() => nestedObjectSchema.default(null)),
    lazyStringField: lazy(() => string().default(DEFAULT_STRING)),
    lazyNumberField: lazy(() => number().default(DEFAULT_NUMBER)),
    lazyBooleanField: lazy(() => boolean().default(DEFAULT_BOOLEAN)),
});
