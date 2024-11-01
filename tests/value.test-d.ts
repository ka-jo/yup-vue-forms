import { ObjectValidation, ObjectValidationValue } from "@/types";

it("FormValidation.value is type FormValue", () => {
    expectTypeOf<ObjectValidation<TestSchema>["value"]>().toEqualTypeOf<
        ObjectValidationValue<TestSchema>
    >();
});

it("FormValue is not null or undefined", () => {
    expectTypeOf<ObjectValidationValue<TestSchema>>().not.toBeNullable();
});

it("FormValue generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<ObjectValidationValue<string>>().toBeObject();
});

describe("FormValue includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields cannot be undefined", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["optionalField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<ObjectValidationValue<TestSchema>["optionalField"]>();
        });

        it("optional fields are nullable", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["optionalField"]>().toBeNullable();
        });
    });

    describe("including required fields", () => {
        it("required fields cannot be undefined", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["requiredField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<ObjectValidationValue<TestSchema>["requiredField"]>();
        });

        it("required fields are nullable", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["requiredField"]>()
                .exclude<string>()
                .toBeNull();
        });

        it("string field is nullable string", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["stringField"]>().toEqualTypeOf<
                string | null
            >();
        });

        it("number field is nullable number", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["numberField"]>().toEqualTypeOf<
                number | null
            >();
        });

        it("boolean field is nullable boolean", () => {
            expectTypeOf<ObjectValidationValue<TestSchema>["booleanField"]>().toEqualTypeOf<
                boolean | null
            >();
        });

        describe("object field", () => {
            it("is object", () => {
                expectTypeOf<ObjectValidationValue<TestSchema>["nestedObjectField"]>().toBeObject();
            });

            it("is not null or undefined", () => {
                expectTypeOf<
                    ObjectValidationValue<TestSchema>["nestedObjectField"]
                >().not.toBeNullable();
            });
        });
    });
});
