import { useValidation } from "@/main";
import {
    DEFAULT_BOOLEAN,
    DEFAULT_NESTED_OBJECT,
    DEFAULT_NUMBER,
    DEFAULT_STRING,
    DEFAULT_TEST_OBJECT,
    testSchema,
} from "./fixtures/test-schema";
import { VALID_TEST_OBJECT } from "./fixtures/valid-value";

describe("calling reset with no value", () => {
    it("sets value to schema default", () => {
        const form = useValidation({ schema: testSchema, value: VALID_TEST_OBJECT });
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
        const form = useValidation({
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

describe("calling reset with a value", () => {
    it("sets value to that value", () => {
        const form = useValidation({ schema: testSchema });
        expect(form.value).toMatchObject(DEFAULT_TEST_OBJECT);
        form.reset(VALID_TEST_OBJECT);
        expect(form.value).toMatchObject(VALID_TEST_OBJECT);
    });

    it("uses schema default for missing fields", () => {
        const form = useValidation({ schema: testSchema, value: VALID_TEST_OBJECT });
        form.reset({ requiredField: "new field value" });
        expect(form.value).toMatchObject({
            requiredField: "new field value",
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
});

it("callling reset sets isValid to false", () => {
    const form = useValidation({ schema: testSchema, value: VALID_TEST_OBJECT });
    form.validate();
    expect(form.isValid).toBe(true);
    form.reset();
    expect(form.isValid).toBe(false);
});

it("calling reset sets errors to empty array", () => {
    const form = useValidation({
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
