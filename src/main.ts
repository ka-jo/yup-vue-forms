import type {
    AnyObject,
    SchemaDescription,
    SchemaFieldDescription,
    SchemaInnerTypeDescription,
    SchemaLazyDescription,
    SchemaObjectDescription,
    SchemaRefDescription,
} from "yup";
import { reactive, ref, Ref } from "vue";
import { FormFieldState, FormValidation, FormValidationOptions, PartialDeep } from "./types";

export function useFormValidation<T extends object>(
    input: FormValidationOptions<T>
): FormValidation<T> {
    input.value ??= {} as Partial<T>;

    const description = input.schema.describe();

    const form = initializeObjectFormField(description, input.value);

    const reactiveForm = reactive(form) as FormValidation<T>;
    //@ts-ignore
    const thing = reactiveForm.value.nestedObjectField;
    return reactiveForm;
}

function isObjectFieldDescription(
    description: SchemaFieldDescription
): description is SchemaObjectDescription {
    return description.type === "object";
}

function initializeObjectFormField<T extends object>(
    schema: SchemaObjectDescription,
    initialValue: PartialDeep<T> | undefined
): FormFieldState {
    const fieldValues: Record<string, unknown> = Object.assign({}, schema.default, initialValue);
    const value: Record<string, Ref<unknown>> = {} as any;

    for (const [fieldName, fieldSchema] of Object.entries(schema.fields)) {
        const nestedField = initializeFormField(fieldSchema, fieldValues[fieldName]);
        if (nestedField) {
            value[fieldName] = nestedField.value;
        }
    }

    return {
        value: ref(value),
    };
}

function initializeFormField<T>(
    schema: SchemaFieldDescription,
    initialValue: unknown | undefined
): FormFieldState | null {
    if (isObjectFieldDescription(schema)) {
        return initializeObjectFormField(schema, initialValue as AnyObject);
    } else if (isSchemaDescription(schema)) {
        return initializePrimitiveFormField(schema, initialValue);
    } else if (isLazyFieldDescription(schema)) {
        return initializeLazyFormField(schema, initialValue);
    } else {
        return null;
    }
}

function initializePrimitiveFormField<T>(
    schema: SchemaDescription,
    initialValue: T | undefined
): FormFieldState {
    const value = (initialValue ?? schema.default ?? null) as NonNullable<T> | null;
    return { value: ref(value) };
}

function initializeLazyFormField<T>(
    schema: SchemaLazyDescription,
    initialValue?: T
): FormFieldState {
    const value = null;
    return { value: ref(value) };
}

function isRefFieldDescription(
    description: SchemaFieldDescription
): description is SchemaRefDescription {
    return description.type === "ref";
}

function isSchemaDescription(
    description: SchemaFieldDescription
): description is SchemaDescription {
    return "default" in description;
}

function isLazyFieldDescription(
    description: SchemaFieldDescription
): description is SchemaInnerTypeDescription {
    return description.type === "lazy";
}

// const name = object({
//     first: string().required(),
//     last: string().notRequired(),
// });

// const user = object({
//     name: name.default(null).required(),
//     age: number().required(),
// });

// const form = useFormValidation({
//     schema: user,
//     value: {
//         name: {
//             first: "John",
//         },
//         age: 25,
//     },
// });
