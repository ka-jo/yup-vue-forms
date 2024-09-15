import { Ref, ref } from "vue";
import { IFieldState, ReferenceOrSchema } from "./types";
import { AnyObject, ISchema, Schema, ValidateOptions, ValidationError } from "yup";
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
        options: ValidateOptions,
        initialValue: any
    ): IFieldState | undefined {
        if (isObjectSchema(schema)) {
            return Form.initializeForm(schema, options, initialValue);
        } else if (isLazySchema(schema)) {
            schema = schema.resolve({ value: initialValue });
            return Field.initializeField(schema, options, initialValue);
        } else if (isSchema(schema)) {
            return new Field(schema, initialValue, options);
        } else {
            return undefined;
        }
    }
}
