export const isValidLength = (str, len) => {
  if (str.length >= 1 && str.length <= len) return true;
  return false;
};
