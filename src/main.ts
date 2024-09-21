import { reactive } from "vue";
import type { FormValidation, FormValidationOptions } from "./types";
import { Form } from "./Form";

export function useFormValidation<T extends object>(
    input: FormValidationOptions<T>
): FormValidation<T> {
    input.value ??= {} as Partial<T>;

    const form = Form.createForm(input.schema, input.value, input);
    //@ts-ignore: we're relying on the deep ref unwrapping functionality of reactive,
    // but the typing for reactive isn't as robust as this functionality
    // https://github.com/vuejs/core/issues/1324#issuecomment-747479802
    return reactive(form) as FormValidation<T>;
}
