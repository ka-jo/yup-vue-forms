import { customRef, readonly, Ref, ref } from "vue";
import { IFieldState, ReadonlyRef, ReferenceOrSchema } from "./types";
import { AnyObject, Schema, ValidateOptions, ValidationError } from "yup";
import { isLazySchema, isObjectSchema, isSchema } from "./util";
import { Form } from "./Form";

export class Field implements IFieldState {
    #schema: Schema<any>;
    #value: unknown;
    #errors: Ref<ReadonlyArray<string>>;
    #isValid: Ref<boolean>;
    #options: ValidateOptions<AnyObject>;
    #triggerValue!: Function;
    #trackValue!: Function;

    readonly value: Ref<unknown>;
    readonly errors: ReadonlyRef<ReadonlyArray<string>>;
    readonly isValid: ReadonlyRef<boolean>;

    private constructor(schema: Schema, value: unknown, options: ValidateOptions<AnyObject>) {
        // binding methods to instance so "this" isn't bound to Vue's reactive proxy
        this.validate = this.validate.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.#schema = schema;
        this.#value = value;
        this.#errors = ref([]);
        this.#isValid = ref(false);
        this.#options = options;

        this.value = Field.initializeValue(this);
        this.errors = readonly(this.#errors);
        this.isValid = readonly(this.#isValid);
    }

    validate(): boolean {
        try {
            this.#schema.validateSync(this.#value, this.#options);
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
        return this.isValid.value;
    }

    getValue() {
        this.#trackValue();
        return this.#value;
    }

    setValue(value: any) {
        this.#value = value ?? this.#schema.spec.default ?? null;
        this.#triggerValue();
    }

    public static createField(
        schema: ReferenceOrSchema,
        initialValue: any,
        options: ValidateOptions
    ): IFieldState | undefined {
        if (isObjectSchema(schema)) {
            return Form.createForm(schema, initialValue, options);
        } else if (isLazySchema(schema)) {
            schema = schema.resolve({ value: initialValue });
            return Field.createField(schema, initialValue, options);
        } else if (isSchema(schema)) {
            const value = initialValue ?? schema.spec.default ?? null;
            return new Field(schema, value, options);
        } else {
            return undefined;
        }
    }

    private static initializeValue(field: Field): Ref<any> {
        return customRef((track, trigger) => {
            field.#triggerValue = trigger;
            field.#trackValue = track;
            return {
                get: field.getValue,
                set: field.setValue,
            };
        });
    }
}
