import { createContext, useContext, useEffect, useState } from "react"

type UserContextType = {
  email: string | null
  setEmail: (email: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: any }) =>{

    // ? Almacena email en localstorage. Valida cada que usa el contexto

    const [email, setEmailState] = useState<string | null>(() => {
        return localStorage.getItem("userEmail")
    })

    const setEmail = (newEmail: string) => {
        setEmailState(newEmail)
        localStorage.setItem("userEmail", newEmail)
    }

    useEffect(() => {
        if (!email) localStorage.removeItem("userEmail")
    }, [email])

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within UserProvider")
  return context
}