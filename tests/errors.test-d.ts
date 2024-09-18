import { FormValidation, FormErrors } from "@/types";

it("FormValidation.errors is type FormErrors", () => {
    expectTypeOf<FormValidation<TestType>["errors"]>().toEqualTypeOf<FormErrors<TestType>>();
});

it("FormErrors is not null or undefined", () => {
    expectTypeOf<FormErrors<TestType>>().not.toBeNullable();
});

it("FormErrors generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<FormErrors<string>>().toBeObject();
});

it("FormErrors is Iterable<string>", () => {
    expectTypeOf<FormErrors<TestType>>().toMatchTypeOf<Iterable<string>>();
});

describe("FormErrors includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<FormErrors<TestType>["optionalField"]>().not.toBeNull();
            expectTypeOf<FormErrors<TestType>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<FormErrors<TestType>["requiredField"]>().not.toBeNull();
            expectTypeOf<FormErrors<TestType>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is Array<string>", () => {
            expectTypeOf<FormErrors<TestType>["stringField"]>().toEqualTypeOf<Array<string>>();
        });

        it("number field is Array<string>", () => {
            expectTypeOf<FormErrors<TestType>["numberField"]>().toEqualTypeOf<Array<string>>();
        });

        it("boolean field is Array<string>", () => {
            expectTypeOf<FormErrors<TestType>["booleanField"]>().toEqualTypeOf<Array<string>>();
        });

        it("object fields are type FormErrors", () => {
            expectTypeOf<FormErrors<TestType>["nestedObjectField"]>().toEqualTypeOf<
                FormErrors<TestType["nestedObjectField"]>
            >();
        });
    });
});
