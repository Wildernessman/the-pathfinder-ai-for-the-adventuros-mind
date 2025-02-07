
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
import MessageList from '@/components/MessageList';
import ModelSelector from '@/components/ModelSelector';
import { ModelProvider } from '@/types/models';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>('OpenAI');
  const { toast } = useToast();

  // Load messages from localStorage when component mounts
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Validate the parsed messages
        if (Array.isArray(parsedMessages) && parsedMessages.every(msg => 
          msg && 
          typeof msg === 'object' && 
          (msg.role === 'user' || msg.role === 'assistant') && 
          typeof msg.content === 'string'
        )) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('chatMessages');
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newMessage: Message = {
        role: 'user',
        content: content.trim()
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      
      // Save to localStorage after adding user message
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        role: 'assistant',
        content: `This is a placeholder response. To use ${selectedModel || 'OpenAI'}, please add your API key in The Map Room.`
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      // Save to localStorage after adding assistant response
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={() => {}} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader isSidebarOpen={isSidebarOpen} />
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center justify-center' : 'justify-between'} pt-[60px] pb-4`}>
          {messages.length === 0 ? (
            <div className="w-full max-w-3xl px-4 space-y-4">
              <div className="space-y-4">
                <h1 className="mb-8 text-4xl font-semibold text-center">Welcome to The Pathfinder</h1>
                <div className="flex justify-center mb-4">
                  <ModelSelector 
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                  />
                </div>
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
              <ActionButtons />
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              <div className="w-full max-w-3xl mx-auto px-4 py-2 space-y-4">
                <div className="flex justify-center">
                  <ModelSelector 
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                  />
                </div>
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
              <div className="text-xs text-center text-gray-500 py-2">
                The Pathfinder can make mistakes. Please verify important information.
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
