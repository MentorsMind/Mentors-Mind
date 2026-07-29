import { useState, useCallback, useMemo } from "react";
import { validate, type Schema } from "../lib/schemas";

/**
 * Generic form hook that validates against a schema.
 *
 * Features:
 * - Field-level errors that appear **on blur** (not on every keystroke)
 * - Submit callback is only executed when the form is valid
 * - Accessible error messages linked via `aria-describedby`
 */
export function useForm<T extends Record<string, string>>(
  schema: Schema<T>,
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  /** Validate a single field and update errors. */
  const validateField = useCallback(
    (field: keyof T, data: T) => {
      const singleSchema: Schema<T> = { [field]: schema[field] } as Schema<T>;
      const result = validate(singleSchema, data);
      setErrors((prev: Record<string, string>) => {
        const next = { ...prev };
        if (result.errors[field as string]) {
          next[field as string] = result.errors[field as string];
        } else {
          delete next[field as string];
        }
        return next;
      });
      return result.errors[field as string] ?? null;
    },
    [schema],
  );

  /** Validate every field. */
  const validateAll = useCallback(
    (data: T) => {
      const result = validate(schema, data);

      // Mark all fields as touched on submit
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      for (const key of Object.keys(schema)) {
        allTouched[key as keyof T] = true;
      }
      setTouched(allTouched);
      setErrors(result.errors);
      setSubmitted(true);
      return result;
    },
    [schema],
  );

  const handleChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const { name, value } = e.target;

      setValues((prev: T) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing (if previously touched)
      if (touched[name as keyof T]) {
        setErrors((prev: Record<string, string>) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [touched],
  );

  const handleBlur = useCallback(
    (e: { target: { name: string } }) => {
      const { name } = e.target;
      const field = name as keyof T;

      setTouched((prev: Partial<Record<keyof T, boolean>>) => ({
        ...prev,
        [field]: true,
      }));

      // Validate only this field
      validateField(field, values);
    },
    [validateField, values],
  );

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      const result = validateAll(values);
      if (result.valid) {
        await onSubmit(values);
      }
    },
    [validateAll, values, onSubmit],
  );

  /** Convenience: get error for a field (only if touched or submitted). */
  const getError = useCallback(
    (field: keyof T): string | undefined => {
      if (touched[field] || submitted) {
        return errors[field as string];
      }
      return undefined;
    },
    [errors, touched, submitted],
  );

  /** Set a single field value directly (for custom inputs). */
  const setFieldValue = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev: T) => ({ ...prev, [field]: value }));
      setTouched((prev: Partial<Record<keyof T, boolean>>) => ({
        ...prev,
        [field]: true,
      }));
      // Validate single field
      const singleSchema: Schema<T> = { [field]: schema[field] } as Schema<T>;
      const newValues = { ...values, [field]: value };
      const result = validate(singleSchema, newValues);
      setErrors((prev: Record<string, string>) => {
        const next = { ...prev };
        if (result.errors[field as string]) {
          next[field as string] = result.errors[field as string];
        } else {
          delete next[field as string];
        }
        return next;
      });
    },
    [schema, values],
  );

  const isValid = useMemo(() => {
    const result = validate(schema, values);
    return result.valid;
  }, [schema, values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    getError,
    setFieldValue,
    setValues,
    isValid,
  };
}
