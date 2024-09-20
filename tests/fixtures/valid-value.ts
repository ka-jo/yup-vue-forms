export const validNestedObject: NestedObject = {
    nestedRequiredField: "nested required field",
    nestedStringField: "nested string field",
    nestedNumberField: 0,
    nestedBooleanField: false,
};

export const validTestObject: TestSchema = {
    requiredField: "required field",
    stringField: "string field",
    numberField: 0,
    booleanField: false,
    nestedObjectField: validNestedObject,
    lazyObjectField: validNestedObject,
    lazyStringField: "lazy string field",
    lazyNumberField: 0,
    lazyBooleanField: false,
};
