import { Ref } from "vue";
import { AnyObject, ObjectSchema } from "yup";

export interface FormValidationOptions<T extends AnyObject> {
    value?: PartialDeep<T>;
    schema: ObjectSchema<T>;
}

export type PartialDeep<T> = {
    [key in keyof T]?: Required<T>[key] extends object ? PartialDeep<T[key]> : T[key];
};

export interface FormValidationState<T extends AnyObject> {
    value: ValueState<T>;
}

export type FormFieldState = {
    value: Ref<unknown>;
};

export interface ObjectFormFieldState<T extends AnyObject> {
    value: Ref<ObjectValueState<T>>;
}

export interface PrimitiveFormFieldState<T> {
    value: Ref<PrimitiveValueState<T>>;
}

export type ValueState<T> = T extends object
    ? Ref<ObjectValueState<T>>
    : Ref<PrimitiveValueState<T>>;

export type ObjectValueState<T extends AnyObject> = {
    [key in keyof T]-?: ValueState<Required<T>[key]>;
};

export type PrimitiveValueState<T> = NonNullable<T> | null;

export interface FormValidation<T extends AnyObject> {
    value: FormValue<T>;
}

export type FormValue<T extends AnyObject> = {
    [key in keyof T]-?: Required<T>[key] extends AnyObject ? FormValue<T[key]> : T[key] | null;
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
