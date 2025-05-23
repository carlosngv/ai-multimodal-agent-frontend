
import { AuthPage } from '@/features/auth/AuthPage'
import { ChatPage } from '@/features/chat/ChatPage'
import { Navigate } from 'react-router'
import { Route, Routes } from 'react-router'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={ <AuthPage /> } />
      <Route path="/home" element={ <ChatPage /> } />
      <Route path="*" element={<Navigate to="/home" replace/>}/>
    </Routes>
    
  )
}
