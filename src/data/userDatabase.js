export const USER_DATABASE_KEY = "aegis-user-database";
export const SESSION_KEY = "aegis-auth-session";

export const DEFAULT_USERS = [
  { username: "aegis.operator", password: "Secure@2025", role: "Operator" },
  { username: "admin", password: "AegisAdmin!2025", role: "Administrator" },
];

export function getUserDatabase() {
  try {
    const saved = localStorage.getItem(USER_DATABASE_KEY);

    if (!saved) {
      localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read user database:", error);
    return [...DEFAULT_USERS];
  }
}

export function registerUser(username, password) {
  const trimmedUsername = (username || "").trim();
  const trimmedPassword = (password || "").trim();

  if (!trimmedUsername || !trimmedPassword)
    return { ok: false, error: "Username and password are required." };
  if (trimmedPassword.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  const users = getUserDatabase();
  const exists = users.some((user) => user.username === trimmedUsername);

  if (exists) {
    return { ok: false, error: "That username is already registered." };
  }

  const newUser = {
    username: trimmedUsername,
    password: trimmedPassword,
    role: "Operator",
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(updatedUsers));

  return {
    ok: true,
    user: {
      username: newUser.username,
      role: newUser.role,
    },
  };
}

export function authenticateUser(username, password) {
  const trimmedUsername = (username || "").trim();
  const users = getUserDatabase();

  const account = users.find((user) => user.username === trimmedUsername);

  if (!account) return null;
  if (account.password !== password) return null;

  return {
    username: account.username,
    role: account.role,
  };
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUser() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to read session:", error);
    return null;
  }
}
