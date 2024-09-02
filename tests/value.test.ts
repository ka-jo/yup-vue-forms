import { useFormValidation } from "@/main";

import {
    DEFAULT_BOOLEAN,
    DEFAULT_NUMBER,
    DEFAULT_OBJECT,
    DEFAULT_STRING,
    testSchema,
} from "./fixtures/test-schema";

it("value is not null or undefined", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.value).not.toBeNull();
    expect(form.value).not.toBeUndefined();
});

it("value includes all schema fields", () => {
    const form = useFormValidation({ schema: testSchema });
    console.log(form.value);
    expect(form.value).toMatchObject({
        requiredField: expect.anything(),
        optionalField: null,
        stringField: expect.anything(),
        numberField: expect.anything(),
        booleanField: expect.anything(),
        nestedObjectField: expect.objectContaining({
            nestedField: expect.anything(),
        }),
    });
});

describe("value is initialized with default values", () => {
    it("with schema defaults", () => {
        const form = useFormValidation({ schema: testSchema });
        expect(form.value).toMatchObject({
            requiredField: DEFAULT_STRING,
            stringField: DEFAULT_STRING,
            numberField: DEFAULT_NUMBER,
            booleanField: DEFAULT_BOOLEAN,
            nestedObjectField: DEFAULT_OBJECT,
        });
    });

    it("with provided value", () => {
        const testValue = "test";
        const form = useFormValidation({ schema: testSchema, value: { optionalField: testValue } });
        expect(form.value).toMatchObject({
            optionalField: testValue,
        });
    });

    it("provided values overwrite schema defaults", () => {
        const newValues = {
            requiredField: "new value",
            numberField: -1,
            booleanField: false,
        };

        const form = useFormValidation({ schema: testSchema, value: newValues });

        expect(form.value).toMatchObject({
            requiredField: newValues.requiredField,
            numberField: newValues.numberField,
            booleanField: newValues.booleanField,
            optionalField: null,
            stringField: DEFAULT_STRING,
            nestedObjectField: DEFAULT_OBJECT,
        });
    });
});
