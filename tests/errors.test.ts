import { useFormValidation } from "@/main";
import { testSchema } from "./fixtures/test-schema";
import { computed } from "vue";

it("errors is not null or undefined", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.errors).not.toBeNull();
    expect(form.errors).not.toBeUndefined();
});

it("errors is read-only", () => {
    const form = useFormValidation({ schema: testSchema });
    const errors = form.errors;

    expect(() => {
        //@ts-expect-error
        form.errors = {} as any;
    }).toThrow();

    expect(form.errors).toMatchObject(errors);
});

it("errors includes all schema fields", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.errors).toMatchObject<TestSchema>({
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

it("errors for nested object contains all nested fields", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.errors.nestedObjectField).toMatchObject<NestedObject>({
        nestedRequiredField: expect.anything(),
        nestedOptionalField: expect.anything(),
        nestedStringField: expect.anything(),
        nestedNumberField: expect.anything(),
        nestedBooleanField: expect.anything(),
    });
    expect(form.errors.lazyObjectField).toMatchObject<NestedObject>({
        nestedRequiredField: expect.anything(),
        nestedOptionalField: expect.anything(),
        nestedStringField: expect.anything(),
        nestedNumberField: expect.anything(),
        nestedBooleanField: expect.anything(),
    });
});

it("errors is iterable", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.errors).toBeIterable();
});

it("errors for nested object is iterable", () => {
    const form = useFormValidation({ schema: testSchema });
    expect(form.errors.nestedObjectField).toBeIterable();
    expect(form.errors.lazyObjectField).toBeIterable();
});

describe("errors are initialized", () => {
    it("with empty array for primitive fields", () => {
        const form = useFormValidation({ schema: testSchema });
        expect(form.errors).toMatchObject({
            requiredField: [],
            optionalField: [],
            stringField: [],
            numberField: [],
            booleanField: [],
            lazyStringField: [],
            lazyNumberField: [],
            lazyBooleanField: [],
        });
    });

    it("with object for object fields", () => {
        const form = useFormValidation({ schema: testSchema });
        expect(form.errors.nestedObjectField).toMatchObject({
            nestedRequiredField: [],
            nestedOptionalField: [],
            nestedStringField: [],
            nestedNumberField: [],
            nestedBooleanField: [],
        });
        expect(form.errors.lazyObjectField).toMatchObject({
            nestedRequiredField: [],
            nestedOptionalField: [],
            nestedStringField: [],
            nestedNumberField: [],
            nestedBooleanField: [],
        });
    });
});

describe("errors are updated when validate is called", () => {
    it("with array of errors for invalid fields", () => {
        const form = useFormValidation({ schema: testSchema });
        form.value.requiredField = "";
        form.value.nestedObjectField.nestedRequiredField = "";
        form.value.lazyObjectField.nestedRequiredField = "";

        form.validate();

        expect(form.errors).toMatchObject({
            requiredField: ["this is a required field"],
            nestedObjectField: {
                nestedRequiredField: ["this is a required field"],
            },
            lazyObjectField: {
                nestedRequiredField: ["this is a required field"],
            },
        });

        expect(Array.from(form.errors)).toEqual([
            "this is a required field",
            "this is a required field",
            "this is a required field",
        ]);
    });

    it("with empty array for valid fields", () => {
        const form = useFormValidation({ schema: testSchema });

        form.validate();

        expect(form.errors).toMatchObject({
            requiredField: [],
            optionalField: [],
            stringField: [],
            numberField: [],
            booleanField: [],
            nestedObjectField: {
                nestedRequiredField: [],
                nestedOptionalField: [],
                nestedStringField: [],
                nestedNumberField: [],
                nestedBooleanField: [],
            },
            lazyObjectField: {
                nestedRequiredField: [],
                nestedOptionalField: [],
                nestedStringField: [],
                nestedNumberField: [],
                nestedBooleanField: [],
            },
            lazyStringField: [],
            lazyNumberField: [],
            lazyBooleanField: [],
        });
    });

    it("and old errors are cleared when a field becomes valid", () => {
        const form = useFormValidation({ schema: testSchema });
        form.value.requiredField = "";

        form.validate();
        expect(form.errors).toMatchObject({
            requiredField: ["this is a required field"],
        });

        form.value.requiredField = "test";

        form.validate();

        expect(form.errors).toMatchObject({
            requiredField: [],
        });
    });

    it("even if validate is called on a field instead of the form", () => {
        const form = useFormValidation({ schema: testSchema });
        const requiredField = form.fields.requiredField;
        form.value.requiredField = "";
        requiredField.value = "";
        requiredField.validate();

        expect(requiredField.errors).toMatchObject([ expect.stringContaining("required") ]);
        expect(form.errors).toMatchObject({ requiredField: [ expect.stringContaining("required") ] });
        expect(Array.from(form.errors)).toMatchObject([ expect.stringContaining("required") ]);
    });
});

it("errors are reactive when used as an iterable", () => {
    const form = useFormValidation({ schema: testSchema });
    const getErrorsSpy = vi.fn(() => Array.from(form.errors));
    const errors = computed(getErrorsSpy);

    expect(errors.value).toMatchObject([]);
    expect(getErrorsSpy).toHaveBeenCalledTimes(1);

    form.value.requiredField = "";
    form.validate();

    expect(errors.value).toMatchObject([expect.stringContaining("required")]);
    expect(getErrorsSpy).toHaveBeenCalledTimes(2);
});
