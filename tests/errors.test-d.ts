import { ObjectValidation, ObjectErrors } from "@/types";

it("FormValidation.errors is type FormErrors", () => {
    expectTypeOf<ObjectValidation<TestSchema>["errors"]>().toEqualTypeOf<
        ObjectErrors<TestSchema>
    >();
});

it("FormErrors is not null or undefined", () => {
    expectTypeOf<ObjectErrors<TestSchema>>().not.toBeNullable();
});

it("FormErrors generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<ObjectErrors<string>>().toBeObject();
});

it("FormErrors is Iterable<string>", () => {
    expectTypeOf<ObjectErrors<TestSchema>>().toMatchTypeOf<Iterable<string>>();
});

describe("FormErrors includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<ObjectErrors<TestSchema>["optionalField"]>().not.toBeNull();
            expectTypeOf<ObjectErrors<TestSchema>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<ObjectErrors<TestSchema>["requiredField"]>().not.toBeNull();
            expectTypeOf<ObjectErrors<TestSchema>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is Array<string>", () => {
            expectTypeOf<ObjectErrors<TestSchema>["stringField"]>().toEqualTypeOf<Array<string>>();
        });

        it("number field is Array<string>", () => {
            expectTypeOf<ObjectErrors<TestSchema>["numberField"]>().toEqualTypeOf<Array<string>>();
        });

        it("boolean field is Array<string>", () => {
            expectTypeOf<ObjectErrors<TestSchema>["booleanField"]>().toEqualTypeOf<Array<string>>();
        });

        it("object fields are type FormErrors", () => {
            expectTypeOf<ObjectErrors<TestSchema>["nestedObjectField"]>().toEqualTypeOf<
                ObjectErrors<TestSchema["nestedObjectField"]>
            >();
        });
    });
});
