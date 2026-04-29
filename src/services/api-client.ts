export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function get<T>(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };
      message = payload.error ?? payload.message ?? message;
    } catch {
      // Ignore JSON parsing failures and keep the default message.
    }

    throw new ApiClientError(message, response.status);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get,
};
