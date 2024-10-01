export const validNestedObject: NestedObject = {
    nestedRequiredField: "nested valid required field",
    nestedStringField: "nested valid string field",
    nestedNumberField: 0,
    nestedBooleanField: false,
};

export const validTestObject: TestSchema = {
    requiredField: "valid required field",
    stringField: "valid string field",
    numberField: 0,
    booleanField: false,
    nestedObjectField: validNestedObject,
    lazyObjectField: validNestedObject,
    lazyStringField: "valid lazy string field",
    lazyNumberField: 0,
    lazyBooleanField: false,
};
