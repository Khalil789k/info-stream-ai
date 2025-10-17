'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from './mode-toggle';
import { Label } from './ui/label';
import { ArrowLeft, Download, FileText, HelpCircle, Shield, Trash2 } from 'lucide-react';
import { SelectInput } from './ui/select-input';

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
];

type SettingsViewProps = {
  onBack: () => void;
  onLogout: () => void;
};

export function SettingsView({ onBack, onLogout }: SettingsViewProps) {
  const { toast } = useToast();
  
  const handleClearSessions = () => {
    toast({
      title: "Recent Sessions Cleared",
      description: "Your list of recent study session history has been cleared (demo).",
    });
  };
  
  const handleDeleteAccount = () => {
     toast({
      variant: 'destructive',
      title: "Account Deletion",
      description: "Your account has been permanently deleted (demo).",
    });
    onLogout();
  }

  const handleExportData = () => {
    toast({
        title: "Data Exported",
        description: "Your data has been exported as a JSON file (demo).",
    });
  }

  return (
    <div className="grid gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-headline text-2xl md:text-3xl font-bold truncate">Settings</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language &amp; Region</CardTitle>
          <CardDescription>Manage your language preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <SelectInput
            label="Language"
            placeholder="Select a language"
            options={languageOptions}
            defaultValue="en"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Controls</CardTitle>
          <CardDescription>Manage your session history and account data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-muted-foreground">Export all your study sessions and notes.</p>
            </div>
            <Button variant="outline" onClick={handleExportData}><Download className="mr-2 h-4 w-4"/>Export</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <h3 className="font-semibold">Clear Recent Sessions</h3>
              <p className="text-sm text-muted-foreground">Remove all your recent study session history.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Clear History</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your session history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearSessions}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Information about the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
             <Button variant="ghost" className="w-full justify-start gap-2"><HelpCircle /> Help Center</Button>
             <Button variant="ghost" className="w-full justify-start gap-2"><FileText /> Terms of Service</Button>
             <Button variant="ghost" className="w-full justify-start gap-2"><Shield /> Privacy Policy</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>This action is irreversible. Please proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-destructive p-4">
            <div>
              <h3 className="font-semibold text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            </div>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteAccount}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
