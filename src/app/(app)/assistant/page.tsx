
import { ChatInterface } from '@/components/assistant/chat-interface';

export default function AssistantPage() {
  return (
    <div className="flex-1 flex flex-col bg-background h-[calc(100vh-8rem)]">
      <ChatInterface />
    </div>
  );
}
