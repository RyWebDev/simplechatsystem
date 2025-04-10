import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
  } from 'react'
  import axios from '../api/axios'
  
  interface User {
    id: string
    name: string
    email: string
  }
  
  interface StateContext {
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
    getUser: () => void
  }
  
  const stateContext = createContext<StateContext | undefined>(undefined)
  
  export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
  
    async function getUser() {
      try {
        const res = await axios.get('api/user')
        setUser(res.data.user)
      } catch (error) {
        setUser(null)
        console.log(error)
      }
    }
  
  
    
  
    return (
      <stateContext.Provider value={{ user, setUser, getUser }}>
        {children}
      </stateContext.Provider>
    )
  }
  
  const useStateContext = () => {
    const context = useContext(stateContext)
    if (!context) {
      throw new Error('useStateContext must be used within a ContextProvider')
    }
    return context
  }
  
  export default useStateContext
  