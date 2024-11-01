import { reactive } from "vue";
import type { ObjectValidation, ValidationOptions } from "./types";
import { ObjectValidationHandler } from "./ObjectValidationHandler";

export function useValidation<T extends object>(input: ValidationOptions<T>): ObjectValidation<T> {
    input.value ??= {} as Partial<T>;

    const form = ObjectValidationHandler.create(input.schema, input.value, input);
    //@ts-ignore: we're relying on the deep ref unwrapping functionality of reactive,
    // but the typing for reactive isn't as robust as this functionality
    // https://github.com/vuejs/core/issues/1324#issuecomment-747479802
    return reactive(form) as ObjectValidation<T>;
}
