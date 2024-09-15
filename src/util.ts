import {
    AnyObject,
    Lazy,
    ObjectSchema,
    Reference,
    Schema,
    SchemaDescription,
    SchemaFieldDescription,
    SchemaLazyDescription,
    SchemaObjectDescription,
    SchemaRefDescription,
} from "yup";
import { ReferenceOrSchema } from "./types";

export const emptyIterator: Iterator<any> = new Array()[Symbol.iterator]();

export function isObjectSchema(field: ReferenceOrSchema): field is ObjectSchema<AnyObject> {
    return "type" in field && field.type === "object";
}

export function isReference(field: ReferenceOrSchema): field is Reference<any> {
    return "key" in field;
}

export function isLazySchema<T>(field: ReferenceOrSchema): field is Lazy<any, any, any> {
    return "type" in field && field.type === "lazy";
}

export function isSchema(field: ReferenceOrSchema): field is Schema {
    return "__isYupSchema__" in field;
}

export function isObjectDescription(
    description: SchemaFieldDescription
): description is SchemaObjectDescription {
    return description.type === "object";
}

export function isRefDescription(
    description: SchemaFieldDescription
): description is SchemaRefDescription {
    return description.type === "ref";
}

export function isSchemaDescription(
    description: SchemaFieldDescription
): description is SchemaDescription {
    return "default" in description;
}

export function isLazyDescription(
    description: SchemaFieldDescription
): description is SchemaLazyDescription {
    return description.type === "lazy";
}
