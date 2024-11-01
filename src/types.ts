import { Ref, UnwrapNestedRefs } from "vue";
import { AnyObject, ISchema, ObjectSchema, Reference, ValidateOptions } from "yup";

export interface ValidationOptions<T extends AnyObject> extends ValidateOptions {
    value?: PartialDeep<T>;
    schema: ObjectSchema<T>;
}

export type PartialDeep<T> = {
    [key in keyof T]?: NonNullable<T[key]> extends object
        ? PartialDeep<NonNullable<T[key]>> | null
        : T[key] | null;
};

export type ReadonlyRef<T> = Ref<T, never>;

export interface IValidationState {
    value: Ref<unknown>;
    readonly errors: ReadonlyRef<Iterable<string>>;
    readonly isValid: ReadonlyRef<boolean>;

    validate(): boolean;
    reset(value?: unknown): void;
    getValue(): unknown;
    setValue(value: unknown): void;
}

export interface FieldValidationState extends IValidationState {
    readonly errors: ReadonlyRef<ReadonlyArray<string>>;
}

export interface ObjectValidationState extends IValidationState {
    readonly errors: ReadonlyRef<ObjectValidationStateErrors>;
    readonly fields: ReadonlyRef<Record<string, IValidationState>>;
}

export type ObjectValidationStateErrors = Iterable<string> & {
    readonly [key: string]: Iterable<string>;
};

export interface IValidation<T = unknown> {
    value: T | null;
    readonly errors: Iterable<string>;
    readonly isValid: boolean;

    getValue(): T | null;
    setValue(value: T | null | undefined): void;

    validate(): boolean;
    reset(value?: T | null | undefined): void;
}

export interface FieldValidation<T> extends IValidation<T> {
    readonly errors: ReadonlyArray<string>;
}

export interface ObjectValidation<T extends AnyObject>
    extends IValidation<ObjectValidationValue<T>> {
    get value(): ObjectValidationValue<T>;
    set value(value: PartialDeep<T>);
    readonly fields: ObjectValidationFields<T>;
    readonly errors: ObjectValidationErrors<T>;

    reset(value?: PartialDeep<T> | null | undefined): void;
}

export type ObjectValidationValue<T extends AnyObject> = {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? ObjectValidationValue<NonNullable<T[key]>>
        : T[key] | null;
};

export type ObjectValidationFields<T extends AnyObject> = {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? ObjectValidation<NonNullable<T[key]>>
        : IValidation<T[key]>;
};

export type ObjectValidationErrors<T extends AnyObject = AnyObject> = Iterable<string> & {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? ObjectValidationErrors<NonNullable<T[key]>>
        : Array<string>;
};

export type ReferenceOrSchema = Reference<any> | ISchema<any, any, any, any>;

type User = {
    name: string;
    age?: number;
    address?: Address;
};

type Address = {
    street: string;
    city?: string;
    state?: State;
};

type State = {
    abbreviation: string;
    name: string;
};

const form: ObjectValidation<User> = {} as any;
form.value.name; // string | null
form.fields.name.value;
form.value.age; // number | null
form.value.address.street;
form.value.address.city;
form.value.address.state.abbreviation;

type address = User["address"];
type thing = keyof Address;

form.fields.address.fields.state.fields.name;
