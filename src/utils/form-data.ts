type FormDataValue = string | Blob;

export function createFormData(values: Record<string, FormDataValue>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}
