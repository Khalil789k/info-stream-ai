'use client';
import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { DashboardClient, type ProcessedContent } from '@/components/dashboard-client';
import { Button } from './ui/button';
import { PlusCircle, History, PanelLeft } from 'lucide-react';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { SettingsView } from './settings-view';
import { ProfileView } from './profile-view';

// Mock Data for recent sessions
const mockSessions: ProcessedContent[] = [
  {
    id: 'session-1',
    sourceType: 'text',
    sourceTitle: 'History of Ancient Rome',
    sourceText: 'Ancient Rome was a civilization that grew out of a small agricultural community founded on the Italian Peninsula in the 10th century BC...',
    summary: 'This text provides a brief overview of the history of Ancient Rome, from its origins to its eventual decline. It covers key periods and events.',
    keywords: 'Rome, Ancient History, Roman Empire, Republic, Senate',
    notes: '• Founded in 10th century BC\n• Started as agricultural community\n• Grew into a vast empire',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-2',
    sourceType: 'video',
    sourceTitle: 'The Science of Black Holes and the Universe\'s Great Mysteries',
    sourceText: 'Video content placeholder',
    transcription: 'A black hole is a region of spacetime where gravity is so strong that nothing, no particles or even electromagnetic radiation such as light—can escape from it...',
    summary: 'A summary on the science of black holes, derived from the video transcription.',
    keywords: 'Black Hole, Spacetime, Gravity, Light, Physics',
    notes: '• Region of spacetime with strong gravity\n• Nothing can escape, not even light\n• Key concept in astrophysics',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'session-3',
    sourceType: 'text',
    sourceTitle: 'Introduction to Quantum Physics',
    sourceText: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles...',
    summary: 'An introductory text on quantum physics, explaining its core concepts and significance in modern science.',
    keywords: 'Quantum, Physics, Mechanics, Atoms, Subatomic',
    notes: '• Describes nature at atomic scale\n• Key theory in modern physics\n• Deals with probabilities',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];


function SidebarContentComponent({ onSessionSelect, selectedId, onNewSession, loading, sessions, onDone, onSettingsSelect, onProfileSelect, user, onLogout }: { onSessionSelect: (session: any) => void, selectedId: string | undefined, onNewSession: () => void, loading: boolean, sessions: any[], onDone?: () => void, onSettingsSelect: () => void, onProfileSelect: () => void, user: any, onLogout: () => void }) {
  const handleSessionSelect = (session: any) => {
    onSessionSelect(session);
    onDone?.();
  };

  const handleNewSession = () => {
    onNewSession();
    onDone?.();
  }

  const handleSettingsSelect = () => {
    onSettingsSelect();
    onDone?.();
  }

  const handleProfileSelect = () => {
    onProfileSelect();
    onDone?.();
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex h-14 items-center p-2">
          <a href="/" className="flex items-center gap-2">
            <Icons.logo className="h-7 w-7 text-primary" />
            <h1 className="font-headline text-lg font-bold group-data-[state=collapsed]:hidden">Info Stream AI</h1>
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="flex flex-col gap-2">
          <Button variant="default" className="w-full justify-start gap-2" onClick={handleNewSession}>
            <PlusCircle className="h-4 w-4" />
            <span className="group-data-[state=collapsed]:hidden">New Session</span>
          </Button>
          <p className="p-2 text-xs font-semibold text-muted-foreground group-data-[state=collapsed]:hidden">
            Recent Sessions
          </p>
          <SidebarMenu>
            {loading && (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
            {sessions?.map((session: any) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  tooltip={session.sourceTitle}
                  isActive={selectedId === session.id}
                  onClick={() => handleSessionSelect(session)}
                >
                  <History />
                  <span className="truncate">{session.sourceTitle}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <UserNav user={user} onSettingsSelect={handleSettingsSelect} onProfileSelect={handleProfileSelect} onLogout={onLogout} />
      </SidebarFooter>
    </>
  );
}

function MobileSidebar(props: React.ComponentProps<typeof SidebarContentComponent>) {
    return (
        <Sidebar data-state="expanded" className="w-full h-full flex flex-col border-0">
            <SidebarContentComponent {...props} />
        </Sidebar>
    );
}


export function MainDashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [selectedItem, setSelectedItem] = React.useState<ProcessedContent | null>(null);
  const [view, setView] = React.useState<'dashboard' | 'settings' | 'profile'>('dashboard');
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] = React.useState(false);
  const [isMobileSheetOpen, setMobileSheetOpen] = React.useState(false);
  
  // Use mock data
  const [sessions, setSessions] = React.useState(mockSessions);
  const [loading, setLoading] = React.useState(false);


  const handleNewSession = () => {
    setSelectedItem(null);
    setView('dashboard');
  };

  const handleSessionSelect = (session: any) => {
    setSelectedItem({ id: session.id, ...session });
    setView('dashboard');
  };
  
  const handleSessionCreated = (session: ProcessedContent) => {
    const newSession = { ...session, id: `session-${Date.now()}`, createdAt: new Date() };
    setSessions(prev => [newSession, ...prev]);
    setSelectedItem(newSession);
    setView('dashboard');
  }

  const handleSettingsSelect = () => {
    setView('settings');
  }
  
  const handleProfileSelect = () => {
    setView('profile');
  }

  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  };
  
  const getSelectedId = () => {
    if (view === 'settings') return 'settings';
    if (view === 'profile') return 'profile';
    return selectedItem?.id;
  }

  const getPageTitle = () => {
    if (view === 'settings') return 'Settings';
    if (view === 'profile') return 'Profile';
    if (selectedItem) return selectedItem.sourceTitle;
    return 'New Study Session';
  }


  return (
    <div className="flex h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className={cn("hidden md:flex md:flex-col transition-all duration-300", isDesktopSidebarCollapsed ? "md:w-16" : "md:w-64")} data-state={isDesktopSidebarCollapsed ? 'collapsed' : 'expanded'}>
         <SidebarContentComponent
              user={user}
              onLogout={onLogout}
              onSessionSelect={handleSessionSelect}
              selectedId={getSelectedId()}
              onNewSession={handleNewSession}
              onSettingsSelect={handleSettingsSelect}
              onProfileSelect={handleProfileSelect}
              loading={loading}
              sessions={sessions}
            />
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          
          {/* Mobile Sidebar Trigger */}
          <Sheet open={isMobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <PanelLeft className="h-5 w-5"/>
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[300px] flex-col bg-sidebar p-0 text-sidebar-foreground">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through your study sessions and settings.
                </SheetDescription>
              </SheetHeader>
              <MobileSidebar
                user={user}
                onLogout={onLogout}
                onSessionSelect={handleSessionSelect}
                selectedId={getSelectedId()}
                onNewSession={handleNewSession}
                onSettingsSelect={handleSettingsSelect}
                onProfileSelect={handleProfileSelect}
                loading={loading}
                sessions={sessions}
                onDone={() => setMobileSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar Trigger */}
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleDesktopSidebar}>
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <h1 className="flex-1 truncate font-headline text-xl font-bold tracking-tight">
            {getPageTitle()}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {view === 'dashboard' && (
            <DashboardClient
              selectedSession={selectedItem}
              onNewSession={handleNewSession}
              onSessionCreated={handleSessionCreated}
            />
          )}
          {view === 'settings' && <SettingsView onBack={() => setView('dashboard')} onLogout={onLogout} />}
          {view === 'profile' && <ProfileView onBack={() => setView('dashboard')} user={user} />}
        </main>
      </div>
    </div>
  );
}
