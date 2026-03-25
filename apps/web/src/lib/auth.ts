const ADMIN_TOKEN_KEY = "iit-admin-token";
const UPLOAD_USER_AUTH_KEY = "iit-upload-user-authenticated";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getUploadUserAuthenticated() {
  return localStorage.getItem(UPLOAD_USER_AUTH_KEY) === "true";
}

export function setUploadUserAuthenticated(isAuthenticated: boolean) {
  if (isAuthenticated) {
    localStorage.setItem(UPLOAD_USER_AUTH_KEY, "true");
    return;
  }

  localStorage.removeItem(UPLOAD_USER_AUTH_KEY);
}
