
import Message from './Message';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MessageList = ({ messages }: { messages: Message[] }) => {
  // Validate messages before rendering
  const validMessages = Array.isArray(messages) ? messages.filter(msg => 
    msg && 
    typeof msg === 'object' && 
    (msg.role === 'user' || msg.role === 'assistant') && 
    typeof msg.content === 'string'
  ) : [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-4">
        {validMessages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
