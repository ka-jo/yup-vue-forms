import { ObjectValidation, ObjectFields, IValidation } from "@/types";

it("FormValidation.fields is type FormFields", () => {
    expectTypeOf<ObjectValidation<TestSchema>["fields"]>().toEqualTypeOf<
        ObjectFields<TestSchema>
    >();
});

it("FormFields is not null or undefined", () => {
    expectTypeOf<ObjectFields<TestSchema>>().not.toBeNullable();
});

it("FormFields generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<ObjectFields<string>>().toBeObject();
});

describe("FormFields includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<ObjectFields<TestSchema>["optionalField"]>().not.toBeNull();
            expectTypeOf<ObjectFields<TestSchema>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<ObjectFields<TestSchema>["requiredField"]>().not.toBeNull();
            expectTypeOf<ObjectFields<TestSchema>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is FieldValidation<string>", () => {
            expectTypeOf<ObjectFields<TestSchema>["stringField"]>().toEqualTypeOf<
                IValidation<string>
            >();
        });

        it("number field is FieldValidation<number>", () => {
            expectTypeOf<ObjectFields<TestSchema>["numberField"]>().toEqualTypeOf<
                IValidation<number>
            >();
        });

        it("boolean field is FieldValidation<boolean>", () => {
            expectTypeOf<ObjectFields<TestSchema>["booleanField"]>().toEqualTypeOf<
                IValidation<boolean>
            >();
        });

        it("object fields are type FormValidation", () => {
            expectTypeOf<ObjectFields<TestSchema>["nestedObjectField"]>().toEqualTypeOf<
                ObjectValidation<TestSchema["nestedObjectField"]>
            >();
        });
    });
});
