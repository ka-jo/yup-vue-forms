import { Ref, UnwrapNestedRefs } from "vue";
import { AnyObject, ISchema, ObjectSchema, Reference, ValidateOptions } from "yup";

export interface FormValidationOptions<T extends AnyObject> extends ValidateOptions {
    value?: PartialDeep<T>;
    schema: ObjectSchema<T>;
}

export type PartialDeep<T> = {
    [key in keyof T]?: NonNullable<T[key]> extends object
        ? PartialDeep<NonNullable<T[key]>> | null
        : T[key] | null;
};

export type ReadonlyRef<T> = Ref<T, never>;

export interface IFieldState {
    value: Ref<unknown>;
    readonly errors: ReadonlyRef<Iterable<string>>;
    readonly isValid: ReadonlyRef<boolean>;

    validate(): boolean;
    getValue(): unknown;
    setValue(value: unknown): void;
}

export interface FieldState extends IFieldState {
    readonly errors: ReadonlyRef<ReadonlyArray<string>>;
}

export interface FormState extends IFieldState {
    readonly errors: ReadonlyRef<UnwrapNestedRefs<FormErrorState>>;
    readonly fields: ReadonlyRef<Record<string, IFieldState>>;
}

export type FormErrorState = Iterable<string> & {
    readonly [key: string]: Ref<Iterable<string>>;
};

export interface IFieldValidation<T> {
    value: T | null;
    readonly errors: Iterable<string>;
    readonly isValid: boolean;

    getValue(): T | null;
    setValue(value: T | null | undefined): void;

    validate(): boolean;
    reset(value?: T | null | undefined): void;
}

export interface FieldValidation<T> extends IFieldValidation<T> {
    readonly errors: ReadonlyArray<string>;
}

export interface FormValidation<T extends AnyObject> extends IFieldValidation<FormValue<T>> {
    get value(): FormValue<T>;
    set value(value: PartialDeep<T>);
    readonly fields: FormFields<T>;
    readonly errors: FormErrors<T>;

    reset(value?: PartialDeep<T> | null | undefined): void;
}

export type FormValue<T extends AnyObject> = {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? FormValue<NonNullable<T[key]>>
        : T[key] | null;
};

export type FormFields<T extends AnyObject> = {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? FormValidation<NonNullable<T[key]>>
        : IFieldValidation<T[key]>;
};

export type FormErrors<T extends AnyObject> = Iterable<string> & {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? FormErrors<NonNullable<T[key]>>
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

const form: FormValidation<User> = {} as any;
form.value.name; // string | null
form.fields.name.value;
form.value.age; // number | null
form.value.address.street;
form.value.address.city;
form.value.address.state.abbreviation;

type address = User["address"];
type thing = keyof Address;

form.fields.address.fields.state.fields.name;
