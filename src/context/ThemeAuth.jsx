import React, { createContext, useState } from 'react'

export const ThemeProvider = createContext(null)

function ThemeAuth({children}) {
    const [theme, setTheme] = useState(true);

    function toggleTheme() {
        setTheme((prev) => !prev)
    }

  return (
    <ThemeProvider.Provider value={{toggleTheme, theme}}>
        {children}
    </ThemeProvider.Provider>
  )
}

export default ThemeAuth
