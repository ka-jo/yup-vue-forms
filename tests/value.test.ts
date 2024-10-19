import { useValidation } from "@/main";

import {
    DEFAULT_BOOLEAN,
    DEFAULT_NUMBER,
    DEFAULT_NESTED_OBJECT,
    DEFAULT_STRING,
    testSchema,
} from "./fixtures/test-schema";
import { VALID_TEST_OBJECT } from "./fixtures/valid-value";

it("value is not null or undefined", () => {
    const form = useValidation({ schema: testSchema });
    expect(form.value).not.toBeNull();
    expect(form.value).not.toBeUndefined();
});

it("value includes all schema fields", () => {
    const form = useValidation({ schema: testSchema });
    expect(form.value).toMatchObject({
        requiredField: expect.anything(),
        optionalField: null,
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

describe("value is initialized with default values", () => {
    it("with schema defaults", () => {
        const form = useValidation({ schema: testSchema });
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

    it("with provided value", () => {
        const testValue = "test";
        const form = useValidation({ schema: testSchema, value: { optionalField: testValue } });
        expect(form.value).toMatchObject({
            optionalField: testValue,
        });
    });

    it("provided values overwrite schema defaults", () => {
        const newValues = {
            requiredField: "new value",
            numberField: -1,
            booleanField: false,
            lazyStringField: "new value",
        };

        const form = useValidation({ schema: testSchema, value: newValues });

        expect(form.value).toMatchObject({
            requiredField: newValues.requiredField,
            numberField: newValues.numberField,
            booleanField: newValues.booleanField,
            optionalField: null,
            stringField: DEFAULT_STRING,
            nestedObjectField: DEFAULT_NESTED_OBJECT,
            lazyStringField: newValues.lazyStringField,
            lazyNumberField: DEFAULT_NUMBER,
            lazyBooleanField: DEFAULT_BOOLEAN,
        });
    });

    it("provided object value is merged with schema defaults", () => {
        const newValues = {
            nestedObjectField: {
                nestedRequiredField: "new required value",
                nestedNumberField: -1,
                nestedBooleanField: false,
            },
            lazyObjectField: {
                nestedOptionalField: "new optional value",
                nestedStringField: "new string value",
            },
        };

        const form = useValidation({ schema: testSchema, value: newValues });

        expect(form.value).toMatchObject({
            nestedObjectField: {
                nestedRequiredField: newValues.nestedObjectField.nestedRequiredField,
                // Better that the optional field is not given a default so this can test that a field
                // is initialized as null when no value is provided and no schema default is defined
                nestedOptionalField: null,
                nestedStringField: DEFAULT_NESTED_OBJECT.nestedStringField,
                nestedNumberField: newValues.nestedObjectField.nestedNumberField,
                nestedBooleanField: newValues.nestedObjectField.nestedBooleanField,
            },
            lazyObjectField: {
                nestedRequiredField: DEFAULT_NESTED_OBJECT.nestedRequiredField,
                nestedOptionalField: newValues.lazyObjectField.nestedOptionalField,
                nestedStringField: newValues.lazyObjectField.nestedStringField,
                nestedNumberField: DEFAULT_NESTED_OBJECT.nestedNumberField,
                nestedBooleanField: DEFAULT_NESTED_OBJECT.nestedBooleanField,
            },
        });
    });
});

describe("value can be set with a partial", () => {
    it("using empty object", () => {
        const form = useValidation({ schema: testSchema });
        form.value = {};
    });

    it("reinitializes value with defaults", () => {
        const form = useValidation({ schema: testSchema });
        form.value = VALID_TEST_OBJECT;
        expect(form.value).toMatchObject(VALID_TEST_OBJECT);
        form.value = {};
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
});
