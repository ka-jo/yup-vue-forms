import { FormValidation } from "@/types";

it("FormValidation.isValid is not null or undefined", () => {
    expectTypeOf<FormValidation<TestSchema>["isValid"]>().not.toBeNullable();
    expectTypeOf<FormValidation<TestSchema>["isValid"]>().not.toBeUndefined();
});

it("FormValidation.isValid is boolean", () => {
    expectTypeOf<FormValidation<TestSchema>["isValid"]>().toBeBoolean();
});
