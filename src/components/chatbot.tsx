"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Bot, Send, User } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

// Mock server action
const getChatbotResponse = async (input: { documentContent: string, question: string }): Promise<{ answer: string }> => {
  console.log("Getting chatbot response for:", input.question);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock logic
  if (input.question.toLowerCase().includes('hello')) {
    return { answer: "Hello there! How can I help you with this document?" };
  }
  if (input.question.toLowerCase().includes('summary')) {
    return { answer: "Based on the text, the main idea is to demonstrate a frontend-only application. The content covers various aspects of frontend development and UI design." };
  }
  
  return { answer: "I'm a mock chatbot. I can only respond to a few keywords like 'hello' or 'summary'. In a real app, I would use AI to analyze the document and provide a detailed answer to your question." };
};


type Message = {
  role: 'user' | 'bot';
  content: string;
};


export function Chatbot({ documentContent }: { documentContent: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! Ask me anything about the content of this study session.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Using a timeout to ensure the DOM has updated before scrolling
    setTimeout(() => {
      const scrollArea = (scrollAreaRef.current as any)?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the mock server action now
      const { answer } = await getChatbotResponse({
        documentContent,
        question: input,
      });
      const botMessage: Message = { role: 'bot', content: answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: "Could not get a response. Please try again.",
      });
       setMessages((prev) => prev.filter(msg => msg !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full flex flex-col h-[70vh]">
      <CardHeader>
        <CardTitle>AI Chatbot</CardTitle>
        <CardDescription>Ask questions about your study material.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                {message.role === 'bot' && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("rounded-lg px-4 py-2 max-w-[80%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted w-3/4">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your question..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
