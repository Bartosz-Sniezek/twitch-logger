export const apiRequest = async <T = void>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    options,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(error.message || `Request failed: ${response.statusText}`);
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  return response.json();
};
