import type { FC } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="flex flex-col items-stretch gap-1.5">
      <ThreadListNew />
      <ThreadListItems />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button 
        className="data-[active]:bg-sidebar-accent hover:bg-sidebar-accent flex items-center justify-start gap-3 rounded-xl px-4 py-3 text-start font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
        variant="ghost"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <PlusIcon className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold">New Chat</span>
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root 
      className="data-[active]:bg-sidebar-accent hover:bg-sidebar-accent focus-visible:bg-sidebar-accent focus-visible:ring-ring flex items-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <ThreadListItemPrimitive.Trigger className="flex-grow px-4 py-3 text-start">
        <ThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive />
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemTitle: FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-gray-600 to-gray-700">
        <MessageSquare className="w-3 h-3 text-white" />
      </div>
      <p className="text-sm text-white font-medium">
        <ThreadListItemPrimitive.Title fallback="New Chat" />
      </p>
    </div>
  );
};

const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="hover:text-primary text-white ml-auto mr-3 size-6 p-1 rounded-md hover:bg-white/10 transition-all duration-200"
        variant="ghost"
        tooltip="Archive chat"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <ArchiveIcon className="w-3 h-3" />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
