import { useValidation } from "@/main";
import { testSchema } from "./fixtures/test-schema";
import { VALID_TEST_OBJECT } from "./fixtures/valid-value";

describe("validate returns boolean", () => {
    it("should return true if all fields are valid", () => {
        const form = useValidation({ schema: testSchema, value: VALID_TEST_OBJECT });
        const isValid = form.validate();
        expect(isValid).toBe(true);
        expect(form.isValid).toBe(true);
    });

    it("should return false if any field is invalid", () => {
        const form = useValidation({ schema: testSchema });
        form.value.requiredField = "";
        const isValid = form.validate();
        expect(isValid).toBe(false);
        expect(form.isValid).toBe(false);
    });
});
