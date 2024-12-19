import { Ref } from "vue";
import { ValidateOptions } from "yup";
import { ReadonlyRef, ReferenceOrSchema } from "./types";
import { PrimitiveValidationHandler } from "./PrimitiveValidationHandler";
import { ObjectValidationHandler } from "./ObjectValidationHandler";
import { isObjectSchema, isLazySchema, isSchema } from "./util";

export interface IValidationHandler {
    value: Ref<unknown>;
    readonly errors: ReadonlyRef<Iterable<string>>;
    readonly isValid: ReadonlyRef<boolean>;

    validate(): boolean;
    reset(value?: unknown): void;
    getValue(): unknown;
    setValue(value: unknown): void;
}

export function createValidationHandler(
    schema: ReferenceOrSchema,
    initialValue: any,
    options: ValidateOptions
): IValidationHandler | undefined {
    if (isObjectSchema(schema)) {
        return ObjectValidationHandler.create(schema, initialValue, options);
    } else if (isLazySchema(schema)) {
        schema = schema.resolve({ value: initialValue });
        return createValidationHandler(schema, initialValue, options);
    } else if (isSchema(schema)) {
        return PrimitiveValidationHandler.create(schema, initialValue, options);
    } else {
        return undefined;
    }
}
