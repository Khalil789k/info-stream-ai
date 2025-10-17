
"use client";

import type { ProcessedContent } from "./dashboard-client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Chatbot } from "./chatbot";
import { TranslationTool } from "./translation-tool";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft, BookText, FileText, Languages, MessageCircle, Type } from "lucide-react";

type ResultsViewProps = {
  content: ProcessedContent;
  onNewSession: () => void;
};

export function ResultsView({ content, onNewSession }: ResultsViewProps) {
  const defaultTab = content.sourceType === 'video' ? 'transcription' : 'summary';

  const hasSummary = !!content.summary;
  const hasKeywords = !!content.keywords || !!content.notes;
  const hasTranscription = !!content.transcription;
  const hasChatContent = content.sourceType === 'video' ? !!content.transcription : !!content.sourceText;
  
  const textForTranslation = content.sourceType === 'video' ? content.transcription! : content.sourceText;
  const textForChat = content.sourceType === 'video' ? content.transcription! : content.sourceText;

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onNewSession} aria-label="Back to new session">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-headline text-2xl md:text-3xl font-bold truncate">Analysis Results</h2>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="summary" disabled={!hasSummary} className="gap-1"><BookText className="h-4 w-4"/>Summary</TabsTrigger>
          <TabsTrigger value="keywords" disabled={!hasKeywords} className="gap-1"><Type className="h-4 w-4"/>Notes</TabsTrigger>
          <TabsTrigger value="transcription" disabled={!hasTranscription} className="gap-1"><FileText className="h-4 w-4"/>Transcription</TabsTrigger>
          <TabsTrigger value="chatbot" disabled={!hasChatContent} className="gap-1"><MessageCircle className="h-4 w-4"/>Chatbot</TabsTrigger>
          <TabsTrigger value="translate" disabled={!textForTranslation} className="gap-1"><Languages className="h-4 w-4"/>Translate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>A concise overview of the provided text.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <p className="whitespace-pre-wrap font-serif text-base md:text-lg break-words">{content.summary}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
                <CardDescription>Key terms extracted from the text.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <p className="whitespace-pre-wrap break-words">{content.keywords}</p>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Study Notes</CardTitle>
                <CardDescription>AI-generated notes to help you study.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <p className="whitespace-pre-wrap break-words">{content.notes}</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transcription">
          <Card>
            <CardHeader>
              <CardTitle>Video Transcription</CardTitle>
              <CardDescription>The full text from the uploaded video.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <p className="whitespace-pre-wrap break-words">{content.transcription}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <Chatbot documentContent={textForChat} />
        </TabsContent>

        <TabsContent value="translate">
            <TranslationTool textToTranslate={textForTranslation} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
