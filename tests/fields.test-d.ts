import { FormValidation, FormFields, IFieldValidation } from "@/types";

it("FormValidation.fields is type FormFields", () => {
    expectTypeOf<FormValidation<TestType>["fields"]>().toEqualTypeOf<FormFields<TestType>>();
});

it("FormFields type is not null or undefined", () => {
    expectTypeOf<FormFields<TestType>>().not.toBeNullable();
});

describe("FormFields type includes all fields", () => {
    describe("including optional fields", () => {
        it("optional fields are not null or undefined", () => {
            expectTypeOf<FormFields<TestType>["optionalField"]>().not.toBeNull();
            expectTypeOf<FormFields<TestType>["optionalField"]>().not.toBeUndefined();
        });
    });

    describe("including required fields", () => {
        it("required fields are not null or undefined", () => {
            expectTypeOf<FormFields<TestType>["requiredField"]>().not.toBeNull();
            expectTypeOf<FormFields<TestType>["requiredField"]>().not.toBeUndefined();
        });

        it("string field is FieldValidation<string>", () => {
            expectTypeOf<FormFields<TestType>["stringField"]>().toEqualTypeOf<
                IFieldValidation<string>
            >();
        });

        it("number field is FieldValidation<number>", () => {
            expectTypeOf<FormFields<TestType>["numberField"]>().toEqualTypeOf<
                IFieldValidation<number>
            >();
        });

        it("boolean field is FieldValidation<boolean>", () => {
            expectTypeOf<FormFields<TestType>["booleanField"]>().toEqualTypeOf<
                IFieldValidation<boolean>
            >();
        });

        it("primitive fields are type FieldValidation", () => {
            expectTypeOf<FormFields<TestType>["stringField"]>().toEqualTypeOf<
                IFieldValidation<string>
            >();
            expectTypeOf<FormFields<TestType>["numberField"]>().toEqualTypeOf<
                IFieldValidation<number>
            >();
            expectTypeOf<FormFields<TestType>["booleanField"]>().toEqualTypeOf<
                IFieldValidation<boolean>
            >();
        });

        it("object fields are type FormValidation", () => {
            expectTypeOf<FormFields<TestType>["nestedObjectField"]>().toEqualTypeOf<
                FormValidation<TestType["nestedObjectField"]>
            >();
        });
    });
});
