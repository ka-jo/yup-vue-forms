import { Ref, ref } from "vue";
import { IFieldState, ReferenceOrSchema } from "./types";
import { AnyObject, Schema, ValidateOptions, ValidationError } from "yup";
import { isLazySchema, isObjectSchema, isSchema } from "./util";
import { Form } from "./Form";

export class Field implements IFieldState {
    #schema: Schema<any>;
    #options: ValidateOptions<AnyObject>;

    readonly value: Ref<unknown>;
    readonly errors: Ref<string[]>;
    readonly isValid: Ref<boolean>;

    private constructor(schema: Schema, value: unknown, options: ValidateOptions<AnyObject>) {
        this.#schema = schema;
        this.#options = options;

        this.value = ref(value);
        this.errors = ref([]);
        this.isValid = ref(false);

        this.validate = this.validate.bind(this);
    }

    validate(): boolean {
        try {
            this.#schema.validateSync(this.value.value, this.#options);
            this.isValid.value = true;
            this.errors.value = [];
        } catch (ex) {
            this.isValid.value = false;
            if (ex instanceof ValidationError) {
                this.errors.value = ex.errors;
            } else {
                throw ex;
            }
        }
        return this.isValid.value;
    }

    public static initializeField(
        schema: ReferenceOrSchema,
        initialValue: any,
        options: ValidateOptions
    ): IFieldState | undefined {
        if (isObjectSchema(schema)) {
            return Form.initializeForm(schema, initialValue, options);
        } else if (isLazySchema(schema)) {
            schema = schema.resolve({ value: initialValue });
            return Field.initializeField(schema, initialValue, options);
        } else if (isSchema(schema)) {
            const value = initialValue ?? schema.spec.default ?? null;
            return new Field(schema, value, options);
        } else {
            return undefined;
        }
    }
}
