import { FormValidation, FormErrors } from "@/types";

it("FormValidation.errors is type FormErrors", () => {
    expectTypeOf<FormValidation<TestSchema>["errors"]>().toEqualTypeOf<FormErrors<TestSchema>>();
});

it("FormErrors is not null or undefined", () => {
    expectTypeOf<FormErrors<TestSchema>>().not.toBeNullable();
});

it("FormErrors generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<FormErrors<string>>().toBeObject();
});

it("FormErrors is Iterable<string>", () => {
    expectTypeOf<FormErrors<TestSchema>>().toMatchTypeOf<Iterable<string>>();
});

describe("FormErrors includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<FormErrors<TestSchema>["optionalField"]>().not.toBeNull();
            expectTypeOf<FormErrors<TestSchema>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<FormErrors<TestSchema>["requiredField"]>().not.toBeNull();
            expectTypeOf<FormErrors<TestSchema>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is Array<string>", () => {
            expectTypeOf<FormErrors<TestSchema>["stringField"]>().toEqualTypeOf<Array<string>>();
        });

        it("number field is Array<string>", () => {
            expectTypeOf<FormErrors<TestSchema>["numberField"]>().toEqualTypeOf<Array<string>>();
        });

        it("boolean field is Array<string>", () => {
            expectTypeOf<FormErrors<TestSchema>["booleanField"]>().toEqualTypeOf<Array<string>>();
        });

        it("object fields are type FormErrors", () => {
            expectTypeOf<FormErrors<TestSchema>["nestedObjectField"]>().toEqualTypeOf<
                FormErrors<TestSchema["nestedObjectField"]>
            >();
        });
    });
});
