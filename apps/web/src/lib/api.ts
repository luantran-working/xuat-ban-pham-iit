import type {
  PublicationDetail,
  PublicationHistoryItem,
  PublicationListItem,
  PublicationStatus,
} from "@/types/publication";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://xuatbanpham-api.test.iit.vn";

type AdminPublicationResponse = PublicationDetail & {
  history: PublicationHistoryItem[];
};

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Đã có lỗi xảy ra." }));

    throw new Error(errorBody.message ?? "Đã có lỗi xảy ra.");
  }

  return response.json() as Promise<T>;
}

export function resolveApiUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

export async function fetchPublications(search = "") {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());

  const response = await fetch(
    `${API_BASE_URL}/publications?${params.toString()}`,
  );
  return parseJson<{ items: PublicationListItem[] }>(response);
}

export async function fetchPublicationDetail(id: string) {
  const response = await fetch(`${API_BASE_URL}/publications/${id}`);
  return parseJson<PublicationDetail>(response);
}

export async function uploadPublication(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/publications/upload`, {
    method: "POST",
    body: formData,
  });

  return parseJson<PublicationDetail>(response);
}

export async function adminLogin(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return parseJson<{ username: string; accessToken: string }>(response);
}

export async function fetchAdminPublications(
  token: string,
  search = "",
  status?: PublicationStatus | "ALL",
) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (status && status !== "ALL") params.set("status", status);

  const response = await fetch(
    `${API_BASE_URL}/admin/publications?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseJson<{ items: AdminPublicationResponse[] }>(response);
}

export async function reviewPublication(
  token: string,
  publicationId: string,
  action: "publish" | "suspend",
  note: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/publications/${publicationId}/${action}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note }),
    },
  );

  return parseJson<AdminPublicationResponse>(response);
}
