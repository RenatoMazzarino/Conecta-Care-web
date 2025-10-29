import { AppHeader } from '@/components/app-header';
import { ChatInterface } from '@/components/assistant/chat-interface';

export default function AssistantPage() {
  return (
    <>
      <AppHeader title="AI Medical Assistant" />
      <main className="flex-1 flex flex-col p-4 sm:p-6 bg-background h-[calc(100vh-4rem)]">
        <ChatInterface />
      </main>
    </>
  );
}
