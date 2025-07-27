
"use client";

import type { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import Markdown from 'react-markdown'; // Simple markdown renderer


export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn("flex items-end gap-3 my-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <AvatarFallback><Bot size={18} /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-xl px-4 py-3 shadow-md break-words",
          isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        <Markdown className="prose prose-sm text-inherit max-w-none">
          {message.text}
        </Markdown>
        {message.escalate && !isUser && (
             <p className="mt-2 text-xs italic text-amber-600 dark:text-amber-400">
                If you need immediate help, please contact a professional.
            </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 bg-accent text-accent-foreground">
          <AvatarFallback><User size={18}/></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
