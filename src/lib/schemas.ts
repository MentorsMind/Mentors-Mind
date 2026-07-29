// ─── Custom validation schema engine ─────────────────────────────────────────
// No external dependencies — pure TypeScript manual validation.
// ──────────────────────────────────────────────────────────────────────────────

export interface SchemaField {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  /** Custom validator receives the whole data set so cross-field checks are possible. */
  custom?: (value: string, data: Record<string, string>) => string | null;
}

export type Schema<T> = {
  [K in keyof T]: SchemaField;
};

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates `data` against `schema`.
 * Returns an object with a top-level `valid` flag and a `errors` map of field → message.
 */
export function validate<T extends Record<string, string>>(
  schema: Schema<T>,
  data: T,
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const field of Object.keys(schema)) {
    const rules = schema[field as keyof T];
    if (!rules) continue;

    const value = data[field] ?? "";

    // 1. Required
    if (rules.required && value.trim().length === 0) {
      errors[field] = `${field} is required`;
      continue; // skip further checks if field is empty
    }

    // If field is optional and empty we stop here.
    if (value.trim().length === 0) continue;

    // 2. Email
    if (rules.email) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) {
        errors[field] = "Please enter a valid email address";
        continue;
      }
    }

    // 3. minLength
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      errors[field] = `Must be at least ${rules.minLength} characters`;
      continue;
    }

    // 4. maxLength
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      errors[field] = `Must be no more than ${rules.maxLength} characters`;
      continue;
    }

    // 5. pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = "Invalid format";
      continue;
    }

    // 6. custom validator
    if (rules.custom) {
      const customError = rules.custom(value, data);
      if (customError) {
        errors[field] = customError;
        continue;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

export type LoginFormData = Record<string, string> & {
  email: string;
  password: string;
};

export const loginSchema: Schema<LoginFormData> = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
};

// ──────────────────────────────────────────────────────────────────────────────

export type SignupFormData = Record<string, string> & {
  name: string;
  email: string;
  password: string;
};

export const signupSchema: Schema<SignupFormData> = {
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  password: { required: true, minLength: 8 },
};

// ──────────────────────────────────────────────────────────────────────────────

export type MedicalRegistrationFormData = Record<string, string> & {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  licenseNumber: string;
  experienceYears: string;
  practice: string;
  consultationFee: string;
  about: string;
  state: string;
  country: string;
  specializations: string;
};

/** Nigerian mobile: 070, 080, 081, 090, 091 followed by 8 digits */
const NG_PHONE = /^0[7-9][01]\d{8}$/;

export const medicalRegistrationSchema: Schema<MedicalRegistrationFormData> = {
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  phone: {
    required: true,
    pattern: NG_PHONE,
    custom: (value) => {
      if (!NG_PHONE.test(value))
        return "Enter a valid Nigerian phone number (e.g. 08012345678)";
      return null;
    },
  },
  password: { required: true, minLength: 6 },
  confirmPassword: {
    required: true,
    custom: (value, data) => {
      if (value !== data.password) return "Passwords do not match";
      return null;
    },
  },
  role: { required: true },
  licenseNumber: {
    required: true,
    pattern: /^[A-Za-z0-9/-]{5,20}$/,
    custom: (value) => {
      if (!/^[A-Za-z0-9/-]{5,20}$/.test(value))
        return "License number must be 5–20 alphanumeric characters";
      return null;
    },
  },
  experienceYears: {
    required: true,
    pattern: /^\d+$/,
    custom: (value) => {
      const n = parseInt(value, 10);
      if (isNaN(n) || n < 0 || n > 60)
        return "Experience must be between 0 and 60 years";
      return null;
    },
  },
  practice: { required: true },
  consultationFee: {
    required: true,
    pattern: /^\d+$/,
    custom: (value) => {
      if (parseInt(value, 10) <= 0) return "Fee must be greater than 0";
      return null;
    },
  },
  about: { required: true, minLength: 10 },
  state: { required: true },
  country: { required: true },
  specializations: {
    required: true,
    custom: (value) => {
      const arr = value.split(";").filter(Boolean);
      if (arr.length === 0) return "Select at least one specialization";
      return null;
    },
  },
};

// ──────────────────────────────────────────────────────────────────────────────

export type BookingFormData = Record<string, string> & {
  topic: string;
};

export const bookingSchema: Schema<BookingFormData> = {
  topic: { required: true, minLength: 10 },
};

// ──────────────────────────────────────────────────────────────────────────────

export type ConsultationFormData = Record<string, string> & {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
};

export const consultationSchema: Schema<ConsultationFormData> = {
  patientName: { required: true, minLength: 2 },
  patientEmail: { required: true, email: true },
  patientPhone: {
    required: true,
    pattern: /^\+?[\d\s-]{7,20}$/,
    custom: (value) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15)
        return "Enter a valid phone number (7–15 digits)";
      return null;
    },
  },
  preferredDate: {
    required: true,
    custom: (value) => {
      if (!value) return "Please select a date";
      const d = new Date(value);
      if (isNaN(d.getTime())) return "Invalid date";
      return null;
    },
  },
  preferredTime: {
    required: true,
    custom: (value) => {
      if (!value) return "Please select a time";
      return null;
    },
  },
  reason: { required: true, minLength: 10 },
};
