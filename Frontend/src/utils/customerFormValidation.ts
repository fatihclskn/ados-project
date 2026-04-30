export type CustomerFormValues = Record<string, string>;

const MAX_CONTACTS = 30;

const CAPITALIZED_FIELDS = new Set([
  'brandName',
  'officialTitle',
  'city',
  'country',
  'address',
  'invoiceAddress',
  'financeResponsible',
  'financeContactPerson',
  'collectionNote',
  'financeNote',
  'marketingSegmentNote',
  'summaryNote',
  'salesHandoverNote',
  'notes',
]);

const PHONE_FIELDS = new Set(['companyPhone', 'companyWhatsapp']);
const EMAIL_FIELDS = new Set(['companyEmail', 'invoiceEmail']);

for (let index = 1; index <= MAX_CONTACTS; index += 1) {
  CAPITALIZED_FIELDS.add(`contact${index}FullName`);
  CAPITALIZED_FIELDS.add(`contact${index}Title`);
  PHONE_FIELDS.add(`contact${index}Phone`);
  EMAIL_FIELDS.add(`contact${index}Email`);
}

export function capitalizeWords(value: string) {
  return value.replace(/[^\s-]+/g, (word) => {
    const lowerWord = word.toLocaleLowerCase('tr-TR');
    return `${lowerWord.charAt(0).toLocaleUpperCase('tr-TR')}${lowerWord.slice(1)}`;
  });
}

export function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 10 && digits.startsWith('5')) {
    digits = `0${digits}`;
  }

  const groups = [digits.slice(0, 1), digits.slice(1, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)];
  return groups.filter(Boolean).join(' ');
}

export function isValidEmail(value: string) {
  const email = value.trim();
  return email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(value: string) {
  const phone = value.trim();
  if (phone.length === 0) return true;

  return phone.replace(/\D/g, '').length === 11;
}

export function normalizeCustomerFormField(field: string, value: string) {
  if (PHONE_FIELDS.has(field)) {
    return formatPhone(value);
  }

  if (CAPITALIZED_FIELDS.has(field)) {
    return capitalizeWords(value);
  }

  return value;
}

export function normalizeCustomerForm(values: CustomerFormValues) {
  return Object.fromEntries(
    Object.entries(values).map(([field, value]) => [field, normalizeCustomerFormField(field, value)]),
  ) as CustomerFormValues;
}

export function validateCustomerForm(values: CustomerFormValues) {
  const normalizedValues = normalizeCustomerForm(values);
  const errors: string[] = [];

  if (!normalizedValues.brandName?.trim() || !normalizedValues.customerStatus?.trim() || !normalizedValues.source?.trim()) {
    errors.push('Zorunlu alanları kontrol edin.');
  }

  const hasContactFullName = Array.from({ length: MAX_CONTACTS }, (_, index) => index + 1).some((contactIndex) => {
    return Boolean(normalizedValues[`contact${contactIndex}FullName`]?.trim());
  });

  if (!hasContactFullName) {
    errors.push('En az bir yetkili eklemelisiniz.');
  }

  if (Array.from(PHONE_FIELDS).some((field) => !isValidPhone(normalizedValues[field] ?? ''))) {
    errors.push('Telefon formatı hatalı.');
  }

  if (Array.from(EMAIL_FIELDS).some((field) => !isValidEmail(normalizedValues[field] ?? ''))) {
    errors.push('E-posta formatı hatalı.');
  }

  return {
    errors: Array.from(new Set(errors)),
    isValid: errors.length === 0,
    values: normalizedValues,
  };
}
