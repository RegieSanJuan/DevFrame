type FormDataValue = string | Blob;

export function createFormData(values: Record<string, unknown>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "object" && !(value instanceof Blob)) {
      formData.set(key, JSON.stringify(value));
    } else {
      formData.set(key, String(value));
    }
  });

  return formData;
}
