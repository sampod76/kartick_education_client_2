export const isValidJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
  return true;
};
