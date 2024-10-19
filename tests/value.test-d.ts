import { ObjectValidation, ObjectValue } from "@/types";

it("FormValidation.value is type FormValue", () => {
    expectTypeOf<ObjectValidation<TestSchema>["value"]>().toEqualTypeOf<ObjectValue<TestSchema>>();
});

it("FormValue is not null or undefined", () => {
    expectTypeOf<ObjectValue<TestSchema>>().not.toBeNullable();
});

it("FormValue generic must be an object", () => {
    //@ts-expect-error
    expectTypeOf<ObjectValue<string>>().toBeObject();
});

describe("FormValue includes all fields of generic", () => {
    describe("including optional fields", () => {
        it("optional fields cannot be undefined", () => {
            expectTypeOf<ObjectValue<TestSchema>["optionalField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<ObjectValue<TestSchema>["optionalField"]>();
        });

        it("optional fields are nullable", () => {
            expectTypeOf<ObjectValue<TestSchema>["optionalField"]>().toBeNullable();
        });
    });

    describe("including required fields", () => {
        it("required fields cannot be undefined", () => {
            expectTypeOf<ObjectValue<TestSchema>["requiredField"]>()
                .exclude<undefined>()
                .toMatchTypeOf<ObjectValue<TestSchema>["requiredField"]>();
        });

        it("required fields are nullable", () => {
            expectTypeOf<ObjectValue<TestSchema>["requiredField"]>().exclude<string>().toBeNull();
        });

        it("string field is nullable string", () => {
            expectTypeOf<ObjectValue<TestSchema>["stringField"]>().toEqualTypeOf<string | null>();
        });

        it("number field is nullable number", () => {
            expectTypeOf<ObjectValue<TestSchema>["numberField"]>().toEqualTypeOf<number | null>();
        });

        it("boolean field is nullable boolean", () => {
            expectTypeOf<ObjectValue<TestSchema>["booleanField"]>().toEqualTypeOf<boolean | null>();
        });

        describe("object field", () => {
            it("is object", () => {
                expectTypeOf<ObjectValue<TestSchema>["nestedObjectField"]>().toBeObject();
            });

            it("is not null or undefined", () => {
                expectTypeOf<ObjectValue<TestSchema>["nestedObjectField"]>().not.toBeNullable();
            });
        });
    });
});
