
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
import MessageList from '@/components/MessageList';
import ModelSelector from '@/components/ModelSelector';
import ProjectSidebar from '@/components/ProjectSidebar';
import { ModelProvider } from '@/types/models';
import { createApiRequest } from '@/services/apiService';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>('Google');
  const [apiKey, setApiKey] = useState<string>('');
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
      
      // Load API key from localStorage
      const savedApiKey = localStorage.getItem("apiKey");
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error('Error loading messages or API key:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('chatMessages');
    }
  }, []);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

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

      // Check if API key exists
      if (!apiKey) {
        toast({
          title: "Missing API Key",
          description: `Please add your ${selectedModel} API key in the sidebar.`,
          variant: "destructive"
        });
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: `Please add your ${selectedModel} API key in the sidebar to use this feature.`
        };
        
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return;
      }

      try {
        // Send the request to the API
        const responseText = await createApiRequest(
          selectedModel,
          newMessages,
          apiKey
        );
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: responseText
        };

        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        // Save to localStorage after adding assistant response
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error('API request failed:', error);
        
        // Display error in chat
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        const assistantMessage: Message = {
          role: 'assistant',
          content: `Error: ${errorMessage}`
        };
        
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        
        toast({
          title: "API Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
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
        onApiKeyChange={handleApiKeyChange} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} ${isProjectPanelOpen ? 'mr-64' : 'mr-0'}`}>
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          isProjectPanelOpen={isProjectPanelOpen}
          onProjectPanelToggle={() => setIsProjectPanelOpen(!isProjectPanelOpen)}
        />
        
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

      <ProjectSidebar isOpen={isProjectPanelOpen} />
    </div>
  );
};

export default Index;
