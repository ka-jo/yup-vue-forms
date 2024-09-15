import { Ref, ref, UnwrapNestedRefs } from "vue";
import { ObjectSchema, AnyObject, ValidateOptions } from "yup";
import { FormState, IFieldState, FormErrorState } from "./types";
import { Field } from "./Field";

export class Form implements FormState {
    #options: ValidateOptions;
    #schema: ObjectSchema<AnyObject>;

    value: Ref<AnyObject>;
    errors: Ref<UnwrapNestedRefs<FormErrorState>>;
    isValid: Ref<boolean>;
    fields: Record<string, IFieldState>;

    constructor(
        options: ValidateOptions<AnyObject>,
        schema: ObjectSchema<any>,
        value: AnyObject,
        errors: FormErrorState,
        fields: Record<string, IFieldState>
    ) {
        this.#schema = schema;
        this.#options = options;
        this.value = ref(value);
        this.errors = ref(errors);
        this.isValid = ref(false);
        this.fields = fields;
    }

    validate(): boolean {
        let isValid = true;
        for (const field of Object.values(this.fields)) {
            const isFieldValid = field.validate();
            if (isFieldValid === false) {
                isValid = false;
                if (this.#options.abortEarly) {
                    break;
                }
            }
        }
        this.isValid.value = isValid;

        return isValid;
    }

    public static initializeForm(
        schema: ObjectSchema<any>,
        initialValue: AnyObject | undefined,
        options: ValidateOptions
    ): FormState {
        const defaultValue = Object.assign({}, schema.spec.default, initialValue);
        const fields: Record<string, IFieldState> = {};
        const value: Record<string, Ref<unknown>> = {};
        const errors: FormErrorState = { [Symbol.iterator]: Form.errorIterator };

        for (const [fieldName, fieldSchema] of Object.entries(schema.fields)) {
            const nestedField = Field.initializeField(
                fieldSchema,
                defaultValue[fieldName],
                options
            );

            if (nestedField) {
                fields[fieldName] = nestedField;
                value[fieldName] = nestedField.value;
                errors[fieldName] = nestedField.errors;
            }
        }

        return new Form(options, schema, value, errors, fields);
    }

    private static *errorIterator(this: UnwrapNestedRefs<FormErrorState>): Iterator<string> {
        for (const field in this) {
            for (const error of this[field]) {
                yield error;
            }
        }
    }
}
