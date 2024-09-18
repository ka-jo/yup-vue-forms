import { FormValidation, FormValue } from "@/types";

it("FormValidation.value is type FormValue", () => {
    expectTypeOf<FormValidation<TestType>["value"]>().toEqualTypeOf<FormValue<TestType>>();
});

it("FormValue is not null or undefined", () => {
    expectTypeOf<FormValue<TestType>>().not.toBeNullable();
});

it("FormValue generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<FormValue<string>>().toBeObject();
});

describe("FormValue includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields cannot be undefined", () => {
            expectTypeOf<FormValue<TestType>["optionalField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<FormValue<TestType>["optionalField"]>();
        });

        it("optional fields are nullable", () => {
            expectTypeOf<FormValue<TestType>["optionalField"]>().toBeNullable();
        });
    });

    describe("including required fields", () => {
        it("required fields cannot be undefined", () => {
            expectTypeOf<FormValue<TestType>["requiredField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<FormValue<TestType>["requiredField"]>();
        });

        it("required fields are nullable", () => {
            expectTypeOf<FormValue<TestType>["requiredField"]>().exclude<string>().toBeNull();
        });

        it("string field is nullable string", () => {
            expectTypeOf<FormValue<TestType>["stringField"]>().toEqualTypeOf<string | null>();
        });

        it("number field is nullable number", () => {
            expectTypeOf<FormValue<TestType>["numberField"]>().toEqualTypeOf<number | null>();
        });

        it("boolean field is nullable boolean", () => {
            expectTypeOf<FormValue<TestType>["booleanField"]>().toEqualTypeOf<boolean | null>();
        });

        describe("object field", () => {
            it("is object", () => {
                expectTypeOf<FormValue<TestType>["nestedObjectField"]>().toBeObject();
            });

            it("is not null or undefined", () => {
                expectTypeOf<FormValue<TestType>["nestedObjectField"]>().not.toBeNullable();
            });
        });
    });
});
