declare type TestSchema = {
    requiredField: string;
    optionalField?: string | null;
    stringField: string;
    numberField: number;
    booleanField: boolean;
    nestedObjectField: NestedObject;
    lazyObjectField: NestedObject | null;
    lazyStringField: string;
    lazyNumberField: number;
    lazyBooleanField: boolean;
};

declare type NestedObject = {
    nestedRequiredField: string;
    nestedOptionalField?: string | null;
    nestedStringField: string;
    nestedNumberField: number;
    nestedBooleanField: boolean;
};
