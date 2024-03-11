import { getAuth } from "firebase/auth";

const authback = async (url: string, options: RequestInit = {}): Promise<any> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay usuario autenticado.");
  }

  const idToken = await user.getIdToken();

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
    ...options.headers,
  });

  const requestOptions: RequestInit = { ...options, headers };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default authback;
