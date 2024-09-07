import { useFormValidation } from "@/main";

import {
    DEFAULT_BOOLEAN,
    DEFAULT_NUMBER,
    DEFAULT_OBJECT,
    DEFAULT_STRING,
    NestedObject,
    TestSchema,
    testSchema,
} from "./fixtures/test-schema";
import { FormFields } from "@/types";

it("fields are not null or undefined", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.fields).not.toBeNull();
    expect(form.fields).not.toBeUndefined();
});

it("fields includes all schema fields", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.fields).toMatchObject<FormFields<TestSchema>>({
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
    const form = useFormValidation({ schema: testSchema });
    expect(form.fields.nestedObjectField.fields).toMatchObject<FormFields<NestedObject>>({
        nestedRequiredField: expect.anything(),
        nestedOptionalField: expect.anything(),
        nestedStringField: expect.anything(),
        nestedNumberField: expect.anything(),
        nestedBooleanField: expect.anything(),
    });

    expect(form.fields.lazyObjectField.fields).toMatchObject<FormFields<NestedObject>>({
        nestedRequiredField: expect.anything(),
        nestedOptionalField: expect.anything(),
        nestedStringField: expect.anything(),
        nestedNumberField: expect.anything(),
        nestedBooleanField: expect.anything(),
    });
});

describe("fields are initialized with default values", () => {
    it("with schema defaults", () => {
        const form = useFormValidation({ schema: testSchema });
        expect(form.fields).toMatchObject<FormFields<TestSchema>>({
            requiredField: expect.objectContaining({ value: DEFAULT_STRING }),
            optionalField: expect.objectContaining({ value: null }),
            stringField: expect.objectContaining({ value: DEFAULT_STRING }),
            numberField: expect.objectContaining({ value: DEFAULT_NUMBER }),
            booleanField: expect.objectContaining({ value: DEFAULT_BOOLEAN }),
            nestedObjectField: expect.objectContaining({
                value: DEFAULT_OBJECT,
            }),
            lazyObjectField: expect.objectContaining({
                value: DEFAULT_OBJECT,
            }),
            lazyStringField: expect.objectContaining({ value: DEFAULT_STRING }),
            lazyNumberField: expect.objectContaining({ value: DEFAULT_NUMBER }),
            lazyBooleanField: expect.objectContaining({ value: DEFAULT_BOOLEAN }),
        });
    });

    it("with provided value", () => {
        const testValue = "test";
        const form = useFormValidation({ schema: testSchema, value: { optionalField: testValue } });
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

        const form = useFormValidation({ schema: testSchema, value: newValues });
        expect(form.fields).toMatchObject({
            requiredField: expect.objectContaining({ value: newValues.requiredField }),
            numberField: expect.objectContaining({ value: newValues.numberField }),
            booleanField: expect.objectContaining({ value: newValues.booleanField }),
        });
    });
});

describe("field values change with form value", () => {
    it("changing form value changes field value", () => {
        const form = useFormValidation({ schema: testSchema });
        const newValue = "new value";
        form.value.requiredField = newValue;
        expect(form.fields.requiredField.value).toBe(newValue);
    });

    it("changing field value changes form value", () => {
        const form = useFormValidation({ schema: testSchema });
        const newValue = "new value";
        form.fields.requiredField.value = newValue;
        expect(form.value.requiredField).toBe(newValue);
    });

    it("changing nested field value changes form value", () => {
        const form = useFormValidation({ schema: testSchema });
        const newValue = "new value";
        form.fields.nestedObjectField.fields.nestedRequiredField.value = newValue;
        expect(form.value.nestedObjectField.nestedRequiredField).toBe(newValue);
    });

    it("changing nested form value changes nested field value", () => {
        const form = useFormValidation({ schema: testSchema });
        const newValue = "new value";
        form.value.nestedObjectField.nestedRequiredField = newValue;
        expect(form.fields.nestedObjectField.fields.nestedRequiredField.value).toBe(newValue);
    });
});
