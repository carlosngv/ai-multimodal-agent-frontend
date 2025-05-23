import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'

export const GeneratingBubble = () => {
  return (
    <ChatBubble variant="received">
        <ChatBubbleAvatar src="" fallback="🤖" />
        <ChatBubbleMessage isLoading />
    </ChatBubble>
  )
}
