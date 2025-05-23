import { useEffect, useRef, useState } from 'react'
import { useUser } from '../auth/context/AuthContext'
import { Navigate } from 'react-router'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { GeneratingBubble } from './components/GeneratingBubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { Button } from '@/components/ui/button'
import { CornerDownLeft, Icon, Mic, Paperclip } from 'lucide-react'
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'

export const ChatPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, setMessages] = useState([]);

  // ? Form 
  const [prompt, setPrompt] = useState('')
  const [selectedFile, setSelectedFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null);


  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if( file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
      setSelectedFile( file );
    } else if( file ) {
      alert('Formato de archivo no permitido.')
    }
    event.target.value = '';
	};

  const onHandleFile = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  useEffect(() => {
    
    setIsGenerating(true)
  }, [])
  
  const { email } = useUser()
  if (!email) return <Navigate to="/" replace />

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsGenerating(true);
      console.log(prompt)
      setPrompt('');
    };
    
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (isGenerating || isLoading || !prompt) return;
        setIsGenerating(true);
        console.log(prompt)
        setPrompt('');
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  


  return (
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mx-auto">
      
      <h3>Sesión con el usuario { email }</h3>
      <div className="flex-1 w-full overflow-y-auto py-6">
        <ChatMessageList>

          {messages.length === 0 && (
            <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
              <h1 className="font-bold">Bienvenido a Genesis AI</h1>
              <p className="text-muted-foreground text-sm">
                Este es un prototipo funcional de un agente de inteligencia artificial multimodal.
              </p>
              <p className="text-muted-foreground text-sm">
              </p>
            </div>
          )}

          <ChatBubble variant={'sent'}>
            <ChatBubbleAvatar fallback={ email[0].toUpperCase() } />
            <ChatBubbleMessage variant={'sent'}>
              Hola
            </ChatBubbleMessage>
          </ChatBubble>

          <ChatBubble variant={'received'}>
            <ChatBubbleAvatar fallback="🤖" />
            <ChatBubbleMessage variant={'received'}>
              Hola
            </ChatBubbleMessage>
          </ChatBubble>
          
            
            
          

          {isGenerating && (
            <GeneratingBubble />
          )}
        </ChatMessageList>
      </div>


            <div className="w-full px-4 pb-4">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={prompt}
            onKeyDown={onKeyDown}
            onChange={ ( e ) => setPrompt( e.target.value )}
            placeholder="Type your message here..."
            className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon" onClick={onHandleFile}>
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              
              style={{ display: "none" }}
              onChange={onFileChange}
            />

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              disabled={isLoading}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>

      </div>
    </main>
  )
}
