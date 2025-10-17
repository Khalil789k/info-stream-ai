"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

// Mock server action
const translateText = async (input: { text: string, targetLanguage: string }): Promise<{ translatedText: string }> => {
  console.log(`Translating to ${input.targetLanguage}:`, input.text.substring(0, 50) + "...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    translatedText: `This is a mock translation of the content into ${input.targetLanguage}. In a real application, an AI model would provide an accurate translation.`
  };
};

const languages = [
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Russian", label: "Russian" },
  { value: "Arabic", label: "Arabic" },
];


export function TranslationTool({ textToTranslate }: { textToTranslate: string }) {
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!targetLanguage) {
      toast({
        variant: "destructive",
        title: "No Language Selected",
        description: "Please select a language to translate to.",
      });
      return;
    }
    setIsLoading(true);
    setTranslatedText('');
    try {
      const result = await translateText({ text: textToTranslate, targetLanguage });
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate the text. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translate Content</CardTitle>
        <CardDescription>Translate the material into another language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select onValueChange={setTargetLanguage} value={targetLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleTranslate} disabled={isLoading || !targetLanguage}>
            {isLoading ? "Translating..." : "Translate"}
          </Button>
        </div>
        {(isLoading || translatedText) && (
          <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle>Translation to {targetLanguage}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-80">
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap font-serif text-lg">{translatedText}</p>
                    )}
                </ScrollArea>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
