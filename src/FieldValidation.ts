import { computed, readonly, Ref, ref } from "vue";
import { IValidationState, ReadonlyRef, ReferenceOrSchema } from "./types";
import { AnyObject, Schema, ValidateOptions, ValidationError } from "yup";
import { isLazySchema, isObjectSchema, isSchema } from "./util";
import { ObjectValidation } from "./ObjectValidation";

export class FieldValidation implements IValidationState {
    #schema: Schema<any>;
    #value: Ref<unknown>;
    #errors: Ref<ReadonlyArray<string>>;
    #isValid: Ref<boolean>;
    #options: ValidateOptions<AnyObject>;

    readonly value: Ref<unknown>;
    readonly errors: ReadonlyRef<ReadonlyArray<string>>;
    readonly isValid: ReadonlyRef<boolean>;

    private constructor(schema: Schema, value: unknown, options: ValidateOptions<AnyObject>) {
        // binding methods to instance so "this" isn't bound to Vue's reactive proxy
        this.validate = this.validate.bind(this);
        this.reset = this.reset.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.#schema = schema;
        this.#value = ref(value ?? schema.spec.default ?? null);
        this.#errors = ref([]);
        this.#isValid = ref(false);
        this.#options = options;

        this.value = computed({ get: this.getValue, set: this.setValue });
        this.errors = readonly(this.#errors);
        this.isValid = readonly(this.#isValid);
    }

    validate(): boolean {
        try {
            this.#schema.validateSync(this.#value.value, this.#options);
            this.#isValid.value = true;
            this.#errors.value = [];
        } catch (ex) {
            this.#isValid.value = false;
            if (ex instanceof ValidationError) {
                this.#errors.value = ex.errors;
            } else {
                throw ex;
            }
        }
        return this.#isValid.value;
    }

    reset(value?: unknown) {
        this.setValue(value);
        this.#isValid.value = false;
        this.#errors.value = [];
    }

    getValue() {
        return this.#value.value;
    }

    setValue(value: any) {
        this.#value.value = value ?? this.#schema.spec.default ?? null;
    }

    public static createField(
        schema: ReferenceOrSchema,
        initialValue: any,
        options: ValidateOptions
    ): IValidationState | undefined {
        if (isObjectSchema(schema)) {
            return ObjectValidation.createForm(schema, initialValue, options);
        } else if (isLazySchema(schema)) {
            schema = schema.resolve({ value: initialValue });
            return FieldValidation.createField(schema, initialValue, options);
        } else if (isSchema(schema)) {
            return new FieldValidation(schema, initialValue, options);
        } else {
            return undefined;
        }
    }
}
