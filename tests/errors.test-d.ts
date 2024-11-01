import { ObjectValidation, ObjectValidationErrors } from "@/types";

it("FormValidation.errors is type FormErrors", () => {
    expectTypeOf<ObjectValidation<TestSchema>["errors"]>().toEqualTypeOf<
        ObjectValidationErrors<TestSchema>
    >();
});

it("FormErrors is not null or undefined", () => {
    expectTypeOf<ObjectValidationErrors<TestSchema>>().not.toBeNullable();
});

it("FormErrors generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<ObjectValidationErrors<string>>().toBeObject();
});

it("FormErrors is Iterable<string>", () => {
    expectTypeOf<ObjectValidationErrors<TestSchema>>().toMatchTypeOf<Iterable<string>>();
});

describe("FormErrors includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<ObjectValidationErrors<TestSchema>["optionalField"]>().not.toBeNull();
            expectTypeOf<ObjectValidationErrors<TestSchema>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<ObjectValidationErrors<TestSchema>["requiredField"]>().not.toBeNull();
            expectTypeOf<ObjectValidationErrors<TestSchema>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is Array<string>", () => {
            expectTypeOf<ObjectValidationErrors<TestSchema>["stringField"]>().toEqualTypeOf<
                Array<string>
            >();
        });

        it("number field is Array<string>", () => {
            expectTypeOf<ObjectValidationErrors<TestSchema>["numberField"]>().toEqualTypeOf<
                Array<string>
            >();
        });

        it("boolean field is Array<string>", () => {
            expectTypeOf<ObjectValidationErrors<TestSchema>["booleanField"]>().toEqualTypeOf<
                Array<string>
            >();
        });

        it("object fields are type FormErrors", () => {
            expectTypeOf<ObjectValidationErrors<TestSchema>["nestedObjectField"]>().toEqualTypeOf<
                ObjectValidationErrors<TestSchema["nestedObjectField"]>
            >();
        });
    });
});
