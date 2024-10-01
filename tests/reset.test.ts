import { useFormValidation } from "@/main";
import {
    DEFAULT_BOOLEAN,
    DEFAULT_NESTED_OBJECT,
    DEFAULT_NUMBER,
    DEFAULT_STRING,
    testSchema,
} from "./fixtures/test-schema";
import { validTestObject } from "./fixtures/valid-value";

describe("calling reset with no value", () => {
    it("sets value to schema default", () => {
        const form = useFormValidation({ schema: testSchema, value: validTestObject });
        form.reset();
        expect(form.value).toMatchObject({
            requiredField: DEFAULT_STRING,
            optionalField: null,
            stringField: DEFAULT_STRING,
            numberField: DEFAULT_NUMBER,
            booleanField: DEFAULT_BOOLEAN,
            nestedObjectField: DEFAULT_NESTED_OBJECT,
            lazyObjectField: DEFAULT_NESTED_OBJECT,
            lazyStringField: DEFAULT_STRING,
            lazyNumberField: DEFAULT_NUMBER,
            lazyBooleanField: DEFAULT_BOOLEAN,
        });
    });

    it("does not set value to initial value", () => {
        const form = useFormValidation({
            schema: testSchema,
            value: {
                requiredField: "initial value",
                nestedObjectField: { nestedRequiredField: "nested initial value" },
            },
        });
        form.reset();
        expect(form.value).not.toMatchObject({
            requiredField: "inital value",
            nestedObjectField: { nestedRequiredField: "nested initial value" },
        });
    });
});

it("calling reset with a value sets value to that value", () => {
    const form = useFormValidation({ schema: testSchema, value: validTestObject });
    form.reset({ requiredField: "a new value" });
    expect(form.value).toMatchObject({ requiredField: "a new value" });
});

it("callling reset sets isValid to false", () => {
    const form = useFormValidation({ schema: testSchema, value: validTestObject });
    form.validate();
    expect(form.isValid).toBe(true);
    form.reset();
    expect(form.isValid).toBe(false);
});

it("calling reset sets errors to empty array", () => {
    const form = useFormValidation({
        schema: testSchema,
        value: {
            requiredField: "",
            nestedObjectField: { nestedRequiredField: "" },
        },
    });

    form.validate();

    expect(form.errors.requiredField).not.toHaveLength(0);
    expect(form.errors.nestedObjectField.nestedRequiredField).not.toHaveLength(0);

    form.reset();

    expect(form.errors.requiredField).toMatchObject([]);
    expect(form.errors.nestedObjectField.nestedRequiredField).toMatchObject([]);
});
