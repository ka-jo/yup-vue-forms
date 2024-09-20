import { FormValidation, FormValue } from "@/types";

it("FormValidation.value is type FormValue", () => {
    expectTypeOf<FormValidation<TestSchema>["value"]>().toEqualTypeOf<FormValue<TestSchema>>();
});

it("FormValue is not null or undefined", () => {
    expectTypeOf<FormValue<TestSchema>>().not.toBeNullable();
});

it("FormValue generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<FormValue<string>>().toBeObject();
});

describe("FormValue includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields cannot be undefined", () => {
            expectTypeOf<FormValue<TestSchema>["optionalField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<FormValue<TestSchema>["optionalField"]>();
        });

        it("optional fields are nullable", () => {
            expectTypeOf<FormValue<TestSchema>["optionalField"]>().toBeNullable();
        });
    });

    describe("including required fields", () => {
        it("required fields cannot be undefined", () => {
            expectTypeOf<FormValue<TestSchema>["requiredField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<FormValue<TestSchema>["requiredField"]>();
        });

        it("required fields are nullable", () => {
            expectTypeOf<FormValue<TestSchema>["requiredField"]>().exclude<string>().toBeNull();
        });

        it("string field is nullable string", () => {
            expectTypeOf<FormValue<TestSchema>["stringField"]>().toEqualTypeOf<string | null>();
        });

        it("number field is nullable number", () => {
            expectTypeOf<FormValue<TestSchema>["numberField"]>().toEqualTypeOf<number | null>();
        });

        it("boolean field is nullable boolean", () => {
            expectTypeOf<FormValue<TestSchema>["booleanField"]>().toEqualTypeOf<boolean | null>();
        });

        describe("object field", () => {
            it("is object", () => {
                expectTypeOf<FormValue<TestSchema>["nestedObjectField"]>().toBeObject();
            });

            it("is not null or undefined", () => {
                expectTypeOf<FormValue<TestSchema>["nestedObjectField"]>().not.toBeNullable();
            });
        });
    });
});
