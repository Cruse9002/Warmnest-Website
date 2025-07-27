
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType, Language } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { mentalWellnessChatbot } from '@/ai/flows/mental-wellness-chatbot'; // Ensure this path is correct
import { useToast } from '@/hooks/use-toast';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messagesLength = messages.length; // For stable useEffect dependency

  useEffect(() => {
    // Add initial welcome message from bot only if messages are empty
    if (messages.length === 0) {
      setMessages([
        {
          id: 'initial-bot-message',
          text: t('chatbotWelcome'),
          sender: 'bot',
          timestamp: new Date(),
          language: language,
        }
      ]);
    }
  }, [t, language, messages.length]); // Added messages.length

  useEffect(() => {
    // Scroll to bottom when new messages are added
    const scrollChatToBottom = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    };

    const timerId = setTimeout(scrollChatToBottom, 0);

    return () => clearTimeout(timerId);
  }, [messagesLength]); // Changed dependency to messagesLength

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString() + '-user',
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      language: language,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await mentalWellnessChatbot({
        userMessage: userMessage.text,
        language: language as 'en' | 'ta', 
      });
      
      const botMessage: ChatMessageType = {
        id: Date.now().toString() + '-bot',
        text: response.chatbotResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: language,
        escalate: response.escalateToHuman,
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error calling chatbot flow:", error);
      toast({
        title: "Error",
        description: "Could not connect to the chatbot. Please try again later.",
        variant: "destructive",
      });
      const errorMessage: ChatMessageType = {
        id: Date.now().toString() + '-error',
        text: "Sorry, I couldn't process your request right now.",
        sender: 'bot',
        timestamp: new Date(),
        language: language,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px] border rounded-lg shadow-xl bg-card">
      <header className="p-4 border-b">
        <h2 className="text-xl font-semibold text-primary">{t('mentalWellnessChatbot')}</h2>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
        {isLoading && (
            <div className="flex items-center justify-start my-4 gap-3">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center animate-pulse">B</div>
                <div className="bg-muted px-4 py-3 rounded-xl shadow-md text-sm">
                    Typing...
                </div>
            </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            type="text"
            placeholder={t('typeYourMessage')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-5 w-5" />
            <span className="sr-only">{t('send')}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
