import { useFormValidation } from "@/main";
import { testSchema } from "./fixtures/test-schema";
import { validTestObject } from "./fixtures/valid-value";

it("isValid is initialized to false", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.isValid).toBe(false);
});

it("isValid is true when all fields are valid", () => {
    const form = useFormValidation({ schema: testSchema });
    form.value = validTestObject;
    form.validate();
    expect(form.isValid).toBe(true);
});

describe("isValid is false", () => {
    it("when any field is invalid", () => {
        const form = useFormValidation({ schema: testSchema });
        form.value.requiredField = "";
        form.validate();
        expect(form.fields.requiredField.isValid).toBe(false);
        expect(form.isValid).toBe(false);
    });

    it("when a nested field is invalid", () => {
        const form = useFormValidation({ schema: testSchema });
        form.value.nestedObjectField.nestedRequiredField = "";
        form.validate();
        expect(form.fields.nestedObjectField.fields.nestedRequiredField.isValid).toBe(false);
        expect(form.fields.nestedObjectField.isValid).toBe(false);
        expect(form.isValid).toBe(false);
    });
});

it("isValid updates with fields", () => {
    const form = useFormValidation({ schema: testSchema, value: validTestObject });
    const requiredField = form.fields.requiredField;

    form.validate();

    expect(requiredField.isValid).toBe(true);
    expect(form.isValid).toBe(true);

    requiredField.value = "";
    requiredField.validate();

    expect(requiredField.isValid).toBe(false);
    expect(form.isValid).toBe(false);
})

it("isValid is read-only", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.isValid).toBe(false);

    expect(() => {
        //@ts-expect-error
        form.isValid = true;
    }).toThrow();

    expect(form.isValid).toBe(false);
});

it("field isValid is read-only", () => {
    const form = useFormValidation({ schema: testSchema });
    const requiredField = form.fields.requiredField;

    expect(requiredField.isValid).toBe(true);

    expect(() => {
        //@ts-expect-error
        requiredField.isValid = false;
    }).toThrow();

    expect(requiredField.isValid).toBe(true);
});
