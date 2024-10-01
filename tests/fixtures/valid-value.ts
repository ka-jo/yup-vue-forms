export const VALID_NESTED_OBJECT: NestedObject = {
    nestedRequiredField: "nested valid required field",
    nestedStringField: "nested valid string field",
    nestedNumberField: 0,
    nestedBooleanField: false,
};

export const VALID_TEST_OBJECT: TestSchema = {
    requiredField: "valid required field",
    stringField: "valid string field",
    numberField: 0,
    booleanField: false,
    nestedObjectField: VALID_NESTED_OBJECT,
    lazyObjectField: VALID_NESTED_OBJECT,
    lazyStringField: "valid lazy string field",
    lazyNumberField: 0,
    lazyBooleanField: false,
};
