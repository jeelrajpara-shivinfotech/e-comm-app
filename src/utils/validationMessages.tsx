export const NoramalRequiredField = (field: string) => {
  return `${field} is required.`;
};

export const RequiredField = (field: string) => {
  const formattedField = field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
  return `${formattedField} is required.`;
};

export const DropdownPlaceholder = (field: string) => {
  return `Select ${field.toLowerCase()}`;
};

export const PlaceHolderFormat = (fieldName: string) => {
  return `Enter your ${fieldName.toLowerCase()}`;
};

export const AdditionalInformationFormat = (fieldName: string) => {
  return `Enter ${fieldName.toLowerCase()}`;
};