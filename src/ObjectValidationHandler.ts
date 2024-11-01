import { computed, customRef, reactive, readonly, Ref, ref, UnwrapNestedRefs } from "vue";
import { ObjectSchema, AnyObject, ValidateOptions } from "yup";
import { IValidation, ObjectValidationErrors, ReadonlyRef } from "./types";
import { createValidationHandler, IValidationHandler } from "./IValidationHandler";

export class ObjectValidationHandler implements IValidationHandler {
    #schema: ObjectSchema<AnyObject>;
    /**
     * Internal reactive object containing the form state
     * @remarks This should be treated as an empty object: we don't know its properties and we shouldn't access them directly
     */
    #value: object;
    #options: ValidateOptions;
    #fields: Record<string, IValidationHandler>;
    #trackValue!: Function;
    #triggerValue!: Function;

    readonly value: Ref<AnyObject>;
    readonly errors: ReadonlyRef<ObjectValidationErrors>;
    readonly isValid: ReadonlyRef<boolean>;
    readonly fields: ReadonlyRef<Record<string, IValidation>>;

    constructor(
        options: ValidateOptions<AnyObject>,
        schema: ObjectSchema<any>,
        value: Record<string, Ref<unknown>>,
        errors: Record<string, ReadonlyRef<Iterable<string>>>,
        fields: Record<string, IValidationHandler>
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

        this.value = ObjectValidationHandler.initializeValue(this);
        this.errors = ObjectValidationHandler.initializeErrors(errors);
        this.isValid = ObjectValidationHandler.initializeIsValid(this);
        this.fields = ObjectValidationHandler.initializeFields(fields);
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

    public static create(
        schema: ObjectSchema<any>,
        initialValue: AnyObject | undefined,
        options: ValidateOptions
    ): ObjectValidationHandler {
        const defaultValue = Object.assign({}, schema.spec.default, initialValue);
        const fields: Record<string, IValidationHandler> = {};
        const value: Record<string, Ref<unknown>> = {};
        const errors: Record<string, ReadonlyRef<Iterable<string>>> = {};

        for (const fieldName in schema.fields) {
            const nestedField = createValidationHandler(
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

        return new ObjectValidationHandler(options, schema, value, errors, fields);
    }

    private static *errorIterator(this: Record<string, Ref<Iterable<string>>>): Iterator<string> {
        for (const field of Object.keys(this)) {
            for (const error of this[field].value) {
                yield error;
            }
        }
    }

    private static initializeValue(handler: ObjectValidationHandler): Ref<AnyObject> {
        return customRef((track, trigger) => {
            handler.#trackValue = track;
            handler.#triggerValue = trigger;
            return {
                get: handler.getValue,
                set: handler.setValue,
            };
        });
    }

    private static initializeErrors(
        errors: Record<string, Ref<Iterable<string>>>
    ): ReadonlyRef<ObjectValidationErrors> {
        //@ts-expect-error: it doesn't like adding the iterable protocol because the type doesn't include it, but it's not worth it to get the type "correct"
        errors[Symbol.iterator] = ObjectValidationHandler.errorIterator.bind(errors);
        //@ts-expect-error: this method is a mess, but I'm tired of wrestling with typing
        return readonly(ref(errors));
    }

    private static initializeIsValid(state: ObjectValidationHandler): ReadonlyRef<boolean> {
        return computed(() => ObjectValidationHandler.isValid(state));
    }

    private static initializeFields(
        fields: Record<string, IValidationHandler>
    ): ReadonlyRef<Record<string, IValidation>> {
        //@ts-expect-error: the typing for reactive isn't deeply unwrapping the refs which would turn an IValidationHandler into an IValidation
        return computed(() => reactive(fields));
    }

    private static isValid(state: ObjectValidationHandler) {
        for (const fieldName of Object.keys(state.#fields)) {
            if (state.#fields[fieldName].isValid.value === false) {
                return false;
            }
        }
        return true;
    }
}
