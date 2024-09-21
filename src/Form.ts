import { customRef, reactive, Ref, ref, UnwrapNestedRefs } from "vue";
import { ObjectSchema, AnyObject, ValidateOptions } from "yup";
import { FormState, IFieldState, FormErrorState } from "./types";
import { Field } from "./Field";

export class Form implements FormState {
    #schema: ObjectSchema<AnyObject>;
    /**
     * Internal reactive object containing the form state
     * @remarks This should be treated as an empty object: we don't know its properties and we shouldn't access them directly
     */
    #value: object;
    #options: ValidateOptions;
    #trackValue!: Function;
    #triggerValue!: Function;

    value: Ref<AnyObject>;
    errors: Ref<UnwrapNestedRefs<FormErrorState>>;
    isValid: Ref<boolean>;
    fields: Record<string, IFieldState>;

    constructor(
        options: ValidateOptions<AnyObject>,
        schema: ObjectSchema<any>,
        value: Record<string, Ref<unknown>>,
        errors: FormErrorState,
        fields: Record<string, IFieldState>
    ) {
        // binding methods to instance so "this" isn't bound to Vue's reactive proxy
        this.validate = this.validate.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.#schema = schema;
        this.#value = reactive(value);
        this.#options = options;

        this.value = Form.initializeValue(this);
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

    getValue() {
        this.#trackValue();
        return this.#value;
    }

    setValue(value: AnyObject) {
        value = Object.assign({}, this.#schema.spec.default, value);
        for (const fieldName in this.fields) {
            const field = this.fields[fieldName];
            field.setValue(value[fieldName]);
        }

        this.#triggerValue();
    }

    public static createForm(
        schema: ObjectSchema<any>,
        initialValue: AnyObject | undefined,
        options: ValidateOptions
    ): FormState {
        const defaultValue = Object.assign({}, schema.spec.default, initialValue);
        const fields: Record<string, IFieldState> = {};
        const value: Record<string, Ref<unknown>> = {};
        const errors: FormErrorState = Form.createErrorState();

        for (const fieldName in schema.fields) {
            const fieldSchema = schema.fields[fieldName];

            const nestedField = Field.createField(fieldSchema, defaultValue[fieldName], options);

            if (nestedField) {
                fields[fieldName] = nestedField;
                value[fieldName] = nestedField.value;
                errors[fieldName] = nestedField.errors;
            }
        }

        return new Form(options, schema, value, errors, fields);
    }

    private static createErrorState(): FormErrorState {
        const errors: FormErrorState = {} as FormErrorState;
        errors[Symbol.iterator] = Form.errorIterator.bind(errors);
        return errors;
    }

    private static *errorIterator(this: FormErrorState): Iterator<string> {
        for (const field in this) {
            for (const error of this[field].value) {
                yield error;
            }
        }
    }

    private static initializeValue(form: Form): Ref<AnyObject> {
        return customRef((track, trigger) => {
            form.#trackValue = track;
            form.#triggerValue = trigger;
            return {
                get: form.getValue,
                set: form.setValue,
            };
        });
    }
}
