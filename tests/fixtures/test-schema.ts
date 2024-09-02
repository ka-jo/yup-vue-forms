import { boolean, number, object, string } from "yup";

export const DEFAULT_STRING = "default";
export const DEFAULT_NUMBER = 99;
export const DEFAULT_BOOLEAN = true;
export const DEFAULT_OBJECT = {
    nestedField: "default object field",
};

export const testSchema = object({
    requiredField: string().required().default(DEFAULT_STRING),
    optionalField: string().notRequired(),
    stringField: string().default(DEFAULT_STRING),
    numberField: number().default(DEFAULT_NUMBER),
    booleanField: boolean().default(DEFAULT_BOOLEAN),
    nestedObjectField: object({
        nestedField: string().default(DEFAULT_STRING),
    }).default(DEFAULT_OBJECT),
});
