import { useEffect, useRef, useState } from 'react'
import { useUser } from '../auth/context/AuthContext'
import { Navigate } from 'react-router'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { GeneratingBubble } from './components/GeneratingBubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { Button } from '@/components/ui/button'
import { CornerDownLeft, Paperclip } from 'lucide-react'
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import ReactMarkdown from 'react-markdown'
import { useFile } from '@/common/hooks/useFile';

const typeKeywords: { [key: string]: string } = {
  faq: 'F',
  atrac: 'A',
  file: 'S',
  // agrega más si lo necesitas
};

export const ChatPage = () => {

  const { email } = useUser()
  if (!email) return <Navigate to="/" replace />

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [responseType, setResponseType] = useState<string>('')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hola, ¿en qué puedo ayudarte?', 
    }
  ]);

  // ? Form 
  const [prompt, setPrompt] = useState('')
  const [selectedFile, setSelectedFile] = useState<File>()
  const [base64File, setBase64File] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fileToBase64, onFileChange } = useFile();

  useEffect(() => {
    if (selectedFile) {
      (async () => {
        const base64 = await fileToBase64(selectedFile);
        setBase64File( base64.split(',')[1] );
        
      })();
    }
  }, [selectedFile, fileToBase64]);

 const onRemoveSelectedFile = ( ) => {
  setSelectedFile(undefined);
 }
  const onHandleFile = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setIsGenerating(true)
  }, [])
  


  const getEndpointAndPayload = ( prompt: string, file?: any, type?: any,  ) => {
    if (prompt.toLowerCase().includes("mcp")) {
      return {
        url: "http://127.0.0.1:44777/mcp/chat",
        payload: {
          message: prompt,
          citizen_email: email,
          type,
        },
      };
    }
    return {
      url: "http://127.0.0.1:44777/chat",
      payload: {
        message: prompt,
        citizen_email: email,
        file,
        type,
      },
    };
  }

const getTypeFromPrompt = (prompt: string): string | null => {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('mcp') && lowerPrompt.includes('atrac')) return 'A';
  if (lowerPrompt.includes('mcp') && lowerPrompt.includes('file')) return 'S';
  if (lowerPrompt.includes('faq')) return 'F';
  return null;
}

  const handleReqOptions = ( prompt: string ) => {
    let file = null;
    if( selectedFile && base64File !== '' ) {
      file = {
        file_name: selectedFile.name,
        data: base64File
      }
    }

    const type = getTypeFromPrompt(prompt);

    return { type, file }

  }

  useEffect(() => {
    prompt.toLowerCase().includes('mcp') ? setResponseType('M') : setResponseType('N')
  }, [prompt])
  

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);  
    console.log(prompt.toLowerCase())
    
    
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt }
    ]);

    const { file, type } = handleReqOptions( prompt );

    const { url, payload } = getEndpointAndPayload(prompt, file, type );
    

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify(payload),
    });
    
    if (!response.body) {
      setIsGenerating(false);
      return;
    }
    console.log(response.body)


    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    setMessages((prev) => [
        ...prev,
        { role: "ai", content: '' }
    ]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
      if( responseType === 'N') {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1],role: 'ai', content: result }
        ]);
      }
    }

    console.log({responseType})
    if(responseType === 'M') {
      setIsLoading( true );
      const {response} = JSON.parse(result);
      
      if( type === 'A') {
        result = `Se recomienda visitar ${response['name']}. ${response['description']} Está ubicado en ${response['location']}. El mejor tiempo para visitar: ${response['best_time_to_visit']}`;
      } else {
        result = response
      }
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1],role: 'ai', content: result }
      ]);
      setIsLoading( false );
    }


    setPrompt('');
    setIsGenerating( false )
  };
    

  return (
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mt-0 mx-auto">
      
      <div className="flex-1 w-full overflow-y-auto py-6">
        <ChatMessageList>

          {messages.length === 0 && (
            <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
              <h1 className="font-bold">Bienvenido a Genesis AI, {email}</h1>
              <p className="text-muted-foreground text-sm">
                Este es un prototipo funcional de un agente de inteligencia artificial multimodal.
              </p>
              <p className="text-muted-foreground text-sm">
              </p>
            </div>
          )}


          {
            messages.map( msg => (

              msg.role === 'user' 
              ? (
                <ChatBubble key={ msg.content} variant={'sent'}>
                  <ChatBubbleAvatar fallback={ email[0].toUpperCase() } />
                  <ChatBubbleMessage variant={'sent'}>
                    { msg.content }
                  </ChatBubbleMessage>
                </ChatBubble>

              )
              : (
                <ChatBubble key={ msg.content} variant={'received'}>
                  <ChatBubbleAvatar fallback="🤖" />
                  <ChatBubbleMessage variant={'received'} isLoading={ msg.content === ''}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </ChatBubbleMessage>
                </ChatBubble>

              )
                
            ))
          }

          {(isGenerating || isLoading ) ?? (
            <GeneratingBubble />
          )}
        </ChatMessageList>
      </div>


      <div className="w-full px-4 pb-4">
        <div>
          {
            selectedFile && (
              <div className="flex space-between bg-black text-white mx-auto max-w-[40%] min-w-[30%] m-2 rounded-lg">
                <p className='font-light mt-1 ml-5'> </p>
                <Button onClick={ onRemoveSelectedFile } className="bg-black flex-1 cursor-pointer">{ (selectedFile.name.length <= 23) ? selectedFile.name.substring(0,22) : `${selectedFile.name.substring(0,22)}...` } (Borrar)</Button>
              </div>

            )
          }
        </div>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="mb-20 relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={prompt}
            onChange={ ( e ) => setPrompt( e.target.value )}
            placeholder="Pregunta algo..."
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
              onChange={(e) => onFileChange(e, setSelectedFile)}
            />

            <Button
              disabled={isLoading}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Enviar
              <CornerDownLeft className="size-3.5" />
            </Button>

          </div>
        </form>

      </div>
    </main>
  )
}
