import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    if (!theme && localStorage.getItem("chat-theme", theme)) {
      document.documentElement.dataset.theme = localStorage.getItem(
        "chat-theme",
        theme
      );
    }
    if (theme) {
      localStorage.setItem("chat-theme", theme);
      document.documentElement.dataset.theme = theme;
      return;
    }
  }, [theme]);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, theme, setTheme }}>
      {children}
    </UserContext.Provider>
  );
}
