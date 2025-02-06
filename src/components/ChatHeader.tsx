import { ChevronDown } from "lucide-react";

interface ChatHeaderProps {
  isSidebarOpen?: boolean;
}

const ChatHeader = ({ isSidebarOpen = true }: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 z-30 w-full border-b border-white/20 bg-chatgpt-main/95 backdrop-blur">
      <div className="flex h-[60px] items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${!isSidebarOpen ? 'ml-24' : ''}`}>The Compass</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="h-12 w-12">
          <img 
            src="/lovable-uploads/7d6fca56-e8d8-4d7f-8d4b-af569d985798.png" 
            alt="The Pathfinder Logo" 
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;