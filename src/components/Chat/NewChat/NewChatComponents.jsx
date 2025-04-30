import React from "react";
import { Image, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

////////// new chat components //////////
export function ChatMessage({ message }) {
  // Check if message is a single message object or an array of messages
  const messages = Array.isArray(message) ? message : [message];
  
  return (
    <>
      {messages.map((msg, index) => {
        const isUser = msg.sender === "user";
        
        // Fix: Use msg.content as fallback if msg.text is not available
        const messageText = msg.text || msg.content || "";
        
        return (
          <div key={msg._id || msg.id || index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%]`}>
              <div className={`rounded-lg p-3 ${isUser ? "bg-gray-700" : "bg-gray-800"}`}>
                <ReactMarkdown 
                  className="whitespace-pre-wrap break-words"
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Render inline math
                    inlineMath: ({ value }) => <InlineMath math={value} />,
                    
                    // Render block math
                    math: ({ value }) => <BlockMath math={value} />,
                    
                    // Render code blocks with syntax highlighting
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : 'text';
                      
                      if (language === 'math' || language === 'tex' || language === 'latex') {
                        return <BlockMath math={String(children).replace(/\n$/, '')} />;
                      }
                      
                      return (
                        <SyntaxHighlighter
                          style={dracula}
                          language={language}
                          PreTag="div"
                          className="rounded-md text-sm overflow-auto my-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    },
                    
                    // Style other elements
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-5 my-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-5 my-2" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="border-collapse table-auto w-full" {...props} /></div>,
                    th: ({node, ...props}) => <th className="border border-gray-600 px-4 py-2 text-left" {...props} />,
                    td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-2" {...props} />
                  }}
                >
                  {messageText}
                </ReactMarkdown>
                {msg.image && (
                  <img
                    src={msg.image || "/placeholder.svg"}
                    alt="Message attachment"
                    className="mt-2 rounded-md max-w-full h-auto"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function InputArea({ 
  inputValue, 
  setInputValue, 
  handleSendMessage,
  handleImageSelect,
  selectedImage,
  imagePreview,
  handleRemoveImage,
  fileInputRef
}) {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height with a maximum limit
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  // Handle file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form onSubmit={handleSendMessage} className="relative">
      <div className="rounded-lg bg-gray-800 p-2">
        {/* Image preview section */}
        {imagePreview && (
          <div className="mb-2 relative">
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Selected image" 
                className="rounded-md max-h-40 max-w-full"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="relative flex items-center">
          {/* Image selection button */}
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute left-3 p-2 rounded-full hover:bg-gray-700"
            title="Select image"
          >
            <Image size={20} className="text-gray-400" />
          </button>

          <textarea
            ref={textareaRef}
            className="w-full bg-[#303030] rounded-3xl outline-none resize-none py-3 pl-12 pr-12"
            style={{
              minHeight: '42px',
              maxHeight: '150px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#6b7280 transparent',
              overflowY: 'auto'
            }}
            placeholder="Ask anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />

          {/* Send button positioned at the right */}
          <button 
            type="submit" 
            className="absolute right-3 p-2 rounded-full hover:bg-gray-700"
            disabled={!inputValue.trim() && !selectedImage}
          >
            <Send 
              size={20} 
              className={`${(!inputValue.trim() && !selectedImage) ? 'text-gray-500' : 'text-white'}`} 
            />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageSelect}
        />
      </div>
    </form>
  );
}
