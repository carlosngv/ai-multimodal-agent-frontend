import React, { useState } from 'react'
import { useUser } from './context/AuthContext'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const AuthPage = () => {

    const { setEmail } = useUser()
  const [input, setInput] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail(input)
    navigate("/home")
  }

  return (
    <div className="min-h-screen w-[100%] flex items-center justify-center">
        <Card className="w-[70%] p-10">
            <CardHeader>
                <CardTitle>
                    <h1>¡Bienvenido a Genesis AI!</h1>
                </CardTitle>
                <CardDescription
                    
                >
                    <p className="font-stretch-normal">
                        Ingresa tu correo para comenzar a chatear con nuestros agentes de inteligencia artificial.<br />
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                
                    <Input
                        type="email"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        required
                        placeholder="Correo"
                        className="mb-4 "
                    />
                    
                    <Button type="submit" className="w-full">Entrar</Button>
                </form>
            </CardContent>

        </Card>

    </div>
  )
}
