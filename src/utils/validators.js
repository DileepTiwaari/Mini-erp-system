// src/utils/validators.js
// Basic client-side validation logic for FlowERP forms.
// Keeps forms reliable for users and avoids submitting bad data.

export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isRequired = (val) => {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  return true;
};

export const isPositiveNumber = (val) => {
  const num = Number(val);
  return !isNaN(num) && num >= 0;
};

export const isValidPassword = (password) => {
  // Simple validation for enterprise standard
  return password && password.length >= 6;
};
