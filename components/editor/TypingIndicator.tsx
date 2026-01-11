"use client";

interface TypingIndicatorProps {
  users: string[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const getText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing`;
    }
    if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing`;
    }
    return `${users[0]} and ${users.length - 1} others are typing`;
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 py-2">
      <span>{getText()}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
