import { Ref } from "vue";
import { AnyObject, ObjectSchema } from "yup";

export interface FormValidationOptions<T extends AnyObject> {
    value?: PartialDeep<T>;
    schema: ObjectSchema<T>;
}

export type PartialDeep<T> = {
    [key in keyof T]?: NonNullable<T[key]> extends object
        ? PartialDeep<NonNullable<T[key]>>
        : T[key];
};

export interface FieldState {
    value: Ref<unknown>;
}

export interface FormState extends FieldState {
    fields: Record<string, FieldState>;
}

export interface FieldValidation<T> {
    value: T;
}

export interface FormValidation<T extends AnyObject> extends FieldValidation<FormValue<T>> {
    value: FormValue<T>;
    fields: FormFields<T>;
}

export type FormValue<T extends AnyObject> = {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? FormValue<NonNullable<T[key]>>
        : T[key] | null;
};

export type FormFields<T extends AnyObject> = {
    [key in keyof T]-?: NonNullable<T[key]> extends AnyObject
        ? FormValidation<NonNullable<T[key]>>
        : FieldValidation<T[key]>;
};

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
form.value.age; // number | null
form.value.address.street;
form.value.address.city;
form.value.address.state.abbreviation;

type address = User["address"];
type thing = keyof Address;

form.fields.address.fields.state.fields.name;
