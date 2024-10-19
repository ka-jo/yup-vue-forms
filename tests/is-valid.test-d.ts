import { ObjectValidation } from "@/types";

it("FormValidation.isValid is not null or undefined", () => {
    expectTypeOf<ObjectValidation<TestSchema>["isValid"]>().not.toBeNullable();
    expectTypeOf<ObjectValidation<TestSchema>["isValid"]>().not.toBeUndefined();
});

it("FormValidation.isValid is boolean", () => {
    expectTypeOf<ObjectValidation<TestSchema>["isValid"]>().toBeBoolean();
});
