"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Link, UploadCloud, Video, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export type InputType = 'text' | 'video' | 'file' | 'url';

type UploadFormProps = {
  onTextSubmit: (text: string, title: string) => Promise<void>;
  onVideoSubmit: (videoFile: File, fileName: string) => Promise<void>;
  isProcessing: boolean;
};

// Helper function to generate a short title
const generateShortTitle = (input: string, type: 'file' | 'url'): string => {
  if (type === 'url') {
    try {
      const url = new URL(input);
      // Extract path, remove leading slash, replace hyphens/underscores with spaces
      const pathParts = url.pathname.slice(1).split('/');
      const lastPart = pathParts[pathParts.length - 1] || url.hostname;
      const cleaned = lastPart.replace(/[\-_]/g, ' ').replace(/\.[^/.]+$/, ''); // remove extension
      const words = cleaned.split(' ').filter(Boolean);
      return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } catch (e) {
      return "Web Content";
    }
  } else { // 'file'
    const withoutExtension = input.substring(0, input.lastIndexOf('.')) || input;
    const cleaned = withoutExtension.replace(/[\-_]/g, ' ');
    const words = cleaned.split(' ').filter(Boolean);
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
};


export function UploadForm({ onTextSubmit, onVideoSubmit, isProcessing }: UploadFormProps) {
  const [text, setText] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, fileType: 'video' | 'doc') => {
      let file: File | null = null;
      if ('dataTransfer' in e) { // Drag event
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          file = e.dataTransfer.files?.[0] || null;
      } else { // Change event
          file = e.target.files?.[0] || null;
      }

      if (!file) return;

      const maxSizeMB = fileType === 'video' ? 50 : 10;
      const allowedTypes = fileType === 'video' 
          ? ["video/mp4", "video/quicktime", "video/webm"] 
          : ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

      if (file.size > maxSizeMB * 1024 * 1024) {
          toast({
              variant: "destructive",
              title: "File too large",
              description: `Please upload a file smaller than ${maxSizeMB}MB.`,
          });
          return;
      }
      
      if (fileType === 'video') {
        setVideoFile(file);
      } else {
        setDocFile(file);
      }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover" || e.type === "dragenter") {
      setIsDragOver(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragOver(false);
    }
  };

  const handleAnalyzeFile = async (fileType: 'video' | 'doc') => {
    const file = fileType === 'video' ? videoFile : docFile;
    if (!file) return;

    const shortTitle = generateShortTitle(file.name, 'file');

    if (fileType === 'video') {
        await onVideoSubmit(file, shortTitle);
    } else {
        const mockText = `This is mock content extracted from the file "${file.name}". In a real implementation, the file would be parsed on the backend.`;
        await onTextSubmit(mockText, shortTitle);
    }
  };

  const handleAnalyzeText = async () => {
    await onTextSubmit(text, textTitle);
  };
  
  const handleProcessUrl = async () => {
    if (!url) return;
    const shortTitle = generateShortTitle(url, 'url');
    const mockText = `This is mock content scraped from the URL "${url}". A real implementation would fetch and parse the content from the web page.`;
    await onTextSubmit(mockText, shortTitle);
  }

  const renderFileUpload = (
    fileType: 'video' | 'doc',
    title: string, 
    id: string
    ) => {
        const file = fileType === 'video' ? videoFile : docFile;
        const setFile = fileType === 'video' ? setVideoFile : setDocFile;

        return (
            <div className="space-y-4">
            {file ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-input bg-muted/20 p-4 text-center">
                    <div className="flex flex-col items-center gap-2 text-foreground">
                        <FileText className="h-12 w-12 text-primary" />
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                        <div className='flex items-center gap-2 mt-2'>
                          <Button 
                            onClick={() => handleAnalyzeFile(fileType)} 
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Analyzing..." : `Analyze ${fileType === 'video' ? 'Video' : 'File'}`}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setFile(null)} disabled={isProcessing}>
                              <X className="mr-2 h-4 w-4"/> Remove
                          </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <Label 
                  htmlFor={id}
                  className={cn(
                      "relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input text-center transition-colors",
                      isDragOver ? "border-primary bg-primary/10" : "bg-muted/20 hover:bg-muted/50"
                  )}
                  onDragOver={handleDragEvents}
                  onDragEnter={handleDragEvents}
                  onDragLeave={handleDragEvents}
                  onDrop={(e) => handleFileSelection(e, fileType)}
                >
                  <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="font-semibold text-foreground">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <p className="mt-2 text-xs text-muted-foreground">{title}</p>
                  <Input
                      id={id}
                      type="file"
                      accept={fileType === 'video' ? "video/mp4,video/quicktime,video/webm" : ".pdf,.doc,.docx"}
                      onChange={(e) => handleFileSelection(e, fileType)}
                      disabled={isProcessing}
                      className="absolute h-full w-full opacity-0"
                  />
                </Label>
            )}
            </div>
        );
  }


  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4 md:p-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="text" className="gap-1"><FileText className="h-4 w-4" /> Text</TabsTrigger>
            <TabsTrigger value="video" className="gap-1"><Video className="h-4 w-4" /> Video</TabsTrigger>
            <TabsTrigger value="file" className="gap-1"><UploadCloud className="h-4 w-4" /> File</TabsTrigger>
            <TabsTrigger value="url" className="gap-1"><Link className="h-4 w-4" /> URL</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 pt-4">
             <div className="space-y-2">
              <Label htmlFor="text-title">Title</Label>
               <Input 
                id="text-title"
                placeholder="e.g. 'My History Notes'"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-input">Content</Label>
              <Textarea
                id="text-input"
                placeholder="Paste your article, notes, or any text here..."
                className="min-h-[200px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <Button onClick={handleAnalyzeText} disabled={isProcessing || !text || !textTitle}>
              {isProcessing ? "Analyzing..." : "Analyze Text"}
            </Button>
          </TabsContent>

          <TabsContent value="video" className="space-y-4 pt-4">
            {renderFileUpload('video', "Supports .mp4, .mov, .webm up to 50MB", 'video-upload')}
          </TabsContent>

          <TabsContent value="file" className="space-y-4 pt-4">
            {renderFileUpload('doc', "Supports .pdf, .docx up to 10MB", 'file-upload')}
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="url-input">Enter a URL to analyze</Label>
               <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="relative flex-grow w-full">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                          id="url-input"
                          placeholder="https://example.com/article"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          disabled={isProcessing}
                          className="pl-10"
                      />
                    </div>
                    <Button onClick={handleProcessUrl} disabled={isProcessing || !url} className="w-full md:w-auto">
                      {isProcessing ? "Processing..." : "Process URL"}
                    </Button>
               </div>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}