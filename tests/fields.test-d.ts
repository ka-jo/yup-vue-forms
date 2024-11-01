import { ObjectValidation, ObjectValidationFields, IValidation } from "@/types";

it("FormValidation.fields is type FormFields", () => {
    expectTypeOf<ObjectValidation<TestSchema>["fields"]>().toEqualTypeOf<
        ObjectValidationFields<TestSchema>
    >();
});

it("FormFields is not null or undefined", () => {
    expectTypeOf<ObjectValidationFields<TestSchema>>().not.toBeNullable();
});

it("FormFields generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<ObjectValidationFields<string>>().toBeObject();
});

describe("FormFields includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<ObjectValidationFields<TestSchema>["optionalField"]>().not.toBeNull();
            expectTypeOf<ObjectValidationFields<TestSchema>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<ObjectValidationFields<TestSchema>["requiredField"]>().not.toBeNull();
            expectTypeOf<ObjectValidationFields<TestSchema>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is FieldValidation<string>", () => {
            expectTypeOf<ObjectValidationFields<TestSchema>["stringField"]>().toEqualTypeOf<
                IValidation<string>
            >();
        });

        it("number field is FieldValidation<number>", () => {
            expectTypeOf<ObjectValidationFields<TestSchema>["numberField"]>().toEqualTypeOf<
                IValidation<number>
            >();
        });

        it("boolean field is FieldValidation<boolean>", () => {
            expectTypeOf<ObjectValidationFields<TestSchema>["booleanField"]>().toEqualTypeOf<
                IValidation<boolean>
            >();
        });

        it("object fields are type FormValidation", () => {
            expectTypeOf<ObjectValidationFields<TestSchema>["nestedObjectField"]>().toEqualTypeOf<
                ObjectValidation<TestSchema["nestedObjectField"]>
            >();
        });
    });
});
