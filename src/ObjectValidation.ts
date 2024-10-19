import { computed, customRef, reactive, readonly, Ref, ref, UnwrapNestedRefs } from "vue";
import { ObjectSchema, AnyObject, ValidateOptions } from "yup";
import {
    ObjectValidationState,
    IValidationState,
    FormErrorState,
    ObjectErrors,
    ReadonlyRef,
} from "./types";
import { FieldValidation } from "./FieldValidation";

export class ObjectValidation implements ObjectValidationState {
    #schema: ObjectSchema<AnyObject>;
    /**
     * Internal reactive object containing the form state
     * @remarks This should be treated as an empty object: we don't know its properties and we shouldn't access them directly
     */
    #value: object;
    #options: ValidateOptions;
    #fields: Record<string, IValidationState>;
    #trackValue!: Function;
    #triggerValue!: Function;

    readonly value: Ref<AnyObject>;
    readonly errors: ReadonlyRef<UnwrapNestedRefs<FormErrorState>>;
    readonly isValid: ReadonlyRef<boolean>;
    readonly fields: ReadonlyRef<Record<string, IValidationState>>;

    constructor(
        options: ValidateOptions<AnyObject>,
        schema: ObjectSchema<any>,
        value: Record<string, Ref<unknown>>,
        errors: Record<string, ReadonlyRef<Iterable<string>>>,
        fields: Record<string, IValidationState>
    ) {
        // binding methods to instance so "this" isn't bound to Vue's reactive proxy
        this.validate = this.validate.bind(this);
        this.reset = this.reset.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.#schema = schema;
        this.#value = reactive(value);
        this.#options = options;
        this.#fields = fields;

        this.value = ObjectValidation.initializeValue(this);
        this.errors = ObjectValidation.initializeErrors(errors);
        this.isValid = ObjectValidation.initializeIsValid(this);
        this.fields = ObjectValidation.initializeFields(fields);
    }

    validate(): boolean {
        for (const field of Object.values(this.#fields)) {
            const isFieldValid = field.validate();
            if (isFieldValid === false) {
                if (this.#options.abortEarly) {
                    break;
                }
            }
        }

        return this.isValid.value;
    }

    reset(value?: AnyObject) {
        value = Object.assign({}, this.#schema.spec.default, value) as AnyObject;
        for (const fieldName of Object.keys(this.#fields)) {
            const field = this.#fields[fieldName];
            field.reset(value[fieldName]);
        }
        this.#triggerValue();
    }

    getValue() {
        this.#trackValue();
        return this.#value;
    }

    setValue(value: AnyObject) {
        value = Object.assign({}, this.#schema.spec.default, value);
        for (const fieldName of Object.keys(this.#fields)) {
            const field = this.#fields[fieldName];
            field.setValue(value[fieldName]);
        }

        this.#triggerValue();
    }

    public static createForm(
        schema: ObjectSchema<any>,
        initialValue: AnyObject | undefined,
        options: ValidateOptions
    ): ObjectValidationState {
        const defaultValue = Object.assign({}, schema.spec.default, initialValue);
        const fields: Record<string, IValidationState> = {};
        const value: Record<string, Ref<unknown>> = {};
        const errors: Record<string, ReadonlyRef<Iterable<string>>> = {};

        for (const fieldName in schema.fields) {
            const nestedField = FieldValidation.createField(
                schema.fields[fieldName],
                defaultValue[fieldName],
                options
            );

            if (nestedField) {
                fields[fieldName] = nestedField;
                value[fieldName] = nestedField.value;
                errors[fieldName] = nestedField.errors;
            }
        }

        return new ObjectValidation(options, schema, value, errors, fields);
    }

    private static *errorIterator(this: Record<string, Ref<Iterable<string>>>): Iterator<string> {
        for (const field of Object.keys(this)) {
            for (const error of this[field].value) {
                yield error;
            }
        }
    }

    private static initializeValue(form: ObjectValidation): Ref<AnyObject> {
        return customRef((track, trigger) => {
            form.#trackValue = track;
            form.#triggerValue = trigger;
            return {
                get: form.getValue,
                set: form.setValue,
            };
        });
    }

    private static initializeErrors(
        errors: Record<string, Ref<Iterable<string>>>
    ): ReadonlyRef<UnwrapNestedRefs<FormErrorState>> {
        //@ts-expect-error: it doesn't like adding the iterable protocol because the type doesn't include it, but it's not worth it to get the type "correct"
        errors[Symbol.iterator] = ObjectValidation.errorIterator.bind(errors);
        //@ts-expect-error: this method is a mess, but I'm tired of wrestling with typing
        return readonly(ref(errors));
    }

    private static initializeIsValid(form: ObjectValidation): Readonly<Ref<boolean>> {
        return computed(() => ObjectValidation.isValid(form));
    }

    private static initializeFields(
        fields: Record<string, IValidationState>
    ): ReadonlyRef<Record<string, IValidationState>> {
        const reactiveFields = reactive(fields);
        return computed(() => reactiveFields);
    }

    private static isValid(form: ObjectValidation) {
        for (const fieldName of Object.keys(form.#fields)) {
            if (form.#fields[fieldName].isValid.value === false) {
                return false;
            }
        }
        return true;
    }
}
