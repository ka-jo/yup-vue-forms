import { useValidation } from "@/main";

import {
    DEFAULT_BOOLEAN,
    DEFAULT_NUMBER,
    DEFAULT_NESTED_OBJECT,
    DEFAULT_STRING,
    testSchema,
} from "./fixtures/test-schema";
import { ObjectValidationFields } from "@/types";

it("fields is not null or undefined", () => {
    const form = useValidation({ schema: testSchema });
    expect(form.fields).not.toBeNull();
    expect(form.fields).not.toBeUndefined();
});

it("fields is read-only", () => {
    const form = useValidation({ schema: testSchema });
    const fields = form.fields;

    expect(() => {
        //@ts-expect-error
        form.fields = {} as any;
    }).toThrow();

    expect(form.fields).toMatchObject(fields);
});

it("field fields is readonly", () => {
    const form = useValidation({ schema: testSchema });
    const nestedObject = form.fields.nestedObjectField;
    const fields = nestedObject.fields;
    expect(() => {
        //@ts-expect-error
        nestedObject.fields = {} as any;
    }).toThrow();

    expect(nestedObject.fields).toMatchObject(fields);
});

it("fields includes all schema fields", () => {
    const form = useValidation({ schema: testSchema });
    expect(form.fields).toMatchObject<ObjectValidationFields<TestSchema>>({
        requiredField: expect.anything(),
        optionalField: expect.anything(),
        stringField: expect.anything(),
        numberField: expect.anything(),
        booleanField: expect.anything(),
        nestedObjectField: expect.anything(),
        lazyObjectField: expect.anything(),
        lazyStringField: expect.anything(),
        lazyNumberField: expect.anything(),
        lazyBooleanField: expect.anything(),
    });
});

it("object fields have nested fields", () => {
    const form = useValidation({ schema: testSchema });
    expect(form.fields.nestedObjectField.fields).toMatchObject<
        ObjectValidationFields<NestedObject>
    >({
        nestedRequiredField: expect.anything(),
        nestedOptionalField: expect.anything(),
        nestedStringField: expect.anything(),
        nestedNumberField: expect.anything(),
        nestedBooleanField: expect.anything(),
    });

    expect(form.fields.lazyObjectField.fields).toMatchObject<ObjectValidationFields<NestedObject>>({
        nestedRequiredField: expect.anything(),
        nestedOptionalField: expect.anything(),
        nestedStringField: expect.anything(),
        nestedNumberField: expect.anything(),
        nestedBooleanField: expect.anything(),
    });
});

describe("fields are initialized with default values", () => {
    it("with schema defaults", () => {
        const form = useValidation({ schema: testSchema });
        expect(form.fields).toMatchObject<ObjectValidationFields<TestSchema>>({
            requiredField: expect.objectContaining({ value: DEFAULT_STRING }),
            optionalField: expect.objectContaining({ value: null }),
            stringField: expect.objectContaining({ value: DEFAULT_STRING }),
            numberField: expect.objectContaining({ value: DEFAULT_NUMBER }),
            booleanField: expect.objectContaining({ value: DEFAULT_BOOLEAN }),
            nestedObjectField: expect.objectContaining({
                value: DEFAULT_NESTED_OBJECT,
            }),
            lazyObjectField: expect.objectContaining({
                value: DEFAULT_NESTED_OBJECT,
            }),
            lazyStringField: expect.objectContaining({ value: DEFAULT_STRING }),
            lazyNumberField: expect.objectContaining({ value: DEFAULT_NUMBER }),
            lazyBooleanField: expect.objectContaining({ value: DEFAULT_BOOLEAN }),
        });
    });

    it("with provided value", () => {
        const testValue = "test";
        const form = useValidation({ schema: testSchema, value: { optionalField: testValue } });
        expect(form.fields).toMatchObject({
            optionalField: expect.objectContaining({ value: testValue }),
        });
    });

    it("provided values overwrite schema defaults", () => {
        const newValues = {
            requiredField: "new value",
            numberField: -1,
            booleanField: false,
        };

        const form = useValidation({ schema: testSchema, value: newValues });
        expect(form.fields).toMatchObject({
            requiredField: expect.objectContaining({ value: newValues.requiredField }),
            numberField: expect.objectContaining({ value: newValues.numberField }),
            booleanField: expect.objectContaining({ value: newValues.booleanField }),
        });
    });
});

describe("field values change with form value", () => {
    it("changing form value changes field value", () => {
        const form = useValidation({ schema: testSchema });
        const newValue = "new value";
        form.value.requiredField = newValue;
        expect(form.fields.requiredField.value).toBe(newValue);
    });

    it("changing field value changes form value", () => {
        const form = useValidation({ schema: testSchema });
        const newValue = "new value";
        form.fields.requiredField.value = newValue;
        expect(form.value.requiredField).toBe(newValue);
    });

    it("changing nested field value changes form value", () => {
        const form = useValidation({ schema: testSchema });
        const newValue = "new value";
        form.fields.nestedObjectField.fields.nestedRequiredField.value = newValue;
        expect(form.value.nestedObjectField.nestedRequiredField).toBe(newValue);
    });

    it("changing nested form value changes nested field value", () => {
        const form = useValidation({ schema: testSchema });
        const newValue = "new value";
        form.value.nestedObjectField.nestedRequiredField = newValue;
        expect(form.fields.nestedObjectField.fields.nestedRequiredField.value).toBe(newValue);
    });
});
