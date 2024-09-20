import { FormValidation, FormFields, IFieldValidation } from "@/types";

it("FormValidation.fields is type FormFields", () => {
    expectTypeOf<FormValidation<TestSchema>["fields"]>().toEqualTypeOf<FormFields<TestSchema>>();
});

it("FormFields is not null or undefined", () => {
    expectTypeOf<FormFields<TestSchema>>().not.toBeNullable();
});

it("FormFields generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<FormFields<string>>().toBeObject();
});

describe("FormFields includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<FormFields<TestSchema>["optionalField"]>().not.toBeNull();
            expectTypeOf<FormFields<TestSchema>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<FormFields<TestSchema>["requiredField"]>().not.toBeNull();
            expectTypeOf<FormFields<TestSchema>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is FieldValidation<string>", () => {
            expectTypeOf<FormFields<TestSchema>["stringField"]>().toEqualTypeOf<
                IFieldValidation<string>
            >();
        });

        it("number field is FieldValidation<number>", () => {
            expectTypeOf<FormFields<TestSchema>["numberField"]>().toEqualTypeOf<
                IFieldValidation<number>
            >();
        });

        it("boolean field is FieldValidation<boolean>", () => {
            expectTypeOf<FormFields<TestSchema>["booleanField"]>().toEqualTypeOf<
                IFieldValidation<boolean>
            >();
        });

        it("object fields are type FormValidation", () => {
            expectTypeOf<FormFields<TestSchema>["nestedObjectField"]>().toEqualTypeOf<
                FormValidation<TestSchema["nestedObjectField"]>
            >();
        });
    });
});
