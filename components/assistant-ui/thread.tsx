import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { ToolFallback } from "./tool-fallback";
import BlurText from './BlurText';

export const Thread: FC = () => {
  const threadRef = useRef<any>(null);
  const { state: sidebarState } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save messages to localStorage on every update
  useEffect(() => {
    if (!threadRef.current) return;
    
    const saveMessages = () => {
      const messageNodes = threadRef.current.querySelectorAll('[data-slot="message-content"]');
      const messages = Array.from(messageNodes).map((node: any) => ({
        role: node.closest('[data-slot="message-root"]').classList.contains('user') ? 'user' : 'assistant',
        content: node.textContent,
        timestamp: new Date().toISOString()
      }));
      
      if (messages.length > 0) {
        localStorage.setItem("chatloom-thread-messages", JSON.stringify(messages));
      }
    };

    // Save messages whenever the DOM changes
    const observer = new MutationObserver(saveMessages);
    if (threadRef.current) {
      observer.observe(threadRef.current, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: '0', background: 'none' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'none' }}>
        <ThreadPrimitive.Root
          ref={threadRef}
          className="box-border flex flex-col flex-1 min-h-0 overflow-hidden"
          style={{
            ["--thread-max-width" as string]: "42rem",
            minHeight: 0,
            background: 'none',
          }}
        >
          <div className="flex flex-col flex-1 min-h-0">
            <ThreadPrimitive.Viewport 
              data-slot="thread-viewport"
              className="flex flex-col flex-1 min-h-0 items-center overflow-y-auto scroll-smooth px-4 pt-8 pb-32" 
              style={{ background: 'none' }}
            >
              <ThreadWelcome sidebarState={sidebarState} isMobile={isMobile} />
              <ThreadPrimitive.Messages
                components={{
                  UserMessage: UserMessage,
                  EditComposer: EditComposer,
                  AssistantMessage: AssistantMessage,
                }}
              />
              <ThreadPrimitive.If empty={false}>
                <div className="min-h-8 flex-grow" style={{ background: 'none' }} />
              </ThreadPrimitive.If>
            </ThreadPrimitive.Viewport>
            <div 
              className={cn(
                "fixed bottom-0 left-0 w-full flex justify-center z-20 mb-6 transition-all duration-500 ease-in-out",
                isMobile ? "mobile-input-container" : "",
                sidebarState === 'expanded' && !isMobile ? 'left-[16rem] w-[calc(100%-16rem)]' : 'left-0 w-full'
              )}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="w-full max-w-[var(--thread-max-width)]">
                <Composer />
              </div>
            </div>
          </div>
        </ThreadPrimitive.Root>
      </div>
    </div>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC<{ sidebarState: 'expanded' | 'collapsed'; isMobile: boolean }> = ({ sidebarState, isMobile }) => {
  return (
    <ThreadPrimitive.Empty>
      <div 
        className={cn(
          "welcome-container flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col items-center justify-center transition-all duration-500 ease-in-out",
          sidebarState === 'expanded' && !isMobile ? 'ml-[8rem]' : 'ml-0'
        )}
      >
        <div
          className="welcome-bubble px-8 py-6 mb-4 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(0,0,0,0.18)',
            color: '#f8f8f8',
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90px',
            maxWidth: '100%',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          <BlurText 
            text="How can I help you today?" 
            delay={120} 
            className={cn(
              "font-bold",
              isMobile ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl"
            )} 
            animateBy="words" 
            direction="top" 
          />
        </div>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-full">
      <ThreadPrimitive.Suggestion prompt="Summarize this text" />
      <ThreadPrimitive.Suggestion prompt="Write a poem about technology" />
      <ThreadPrimitive.Suggestion prompt="Explain quantum computing in simple terms" />
      <ThreadPrimitive.Suggestion prompt="Translate 'Hello, how are you?' to French" />
      <ThreadPrimitive.Suggestion prompt="Generate a JavaScript function to reverse a string" />
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="composer-root flex w-full flex-wrap items-end rounded-lg border-none bg-transparent px-2.5 shadow-none transition-colors ease-in">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Write a message..."
        className="input-glass min-h-[40px] max-h-32 overflow-auto flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <button className="send-btn-glass" type="submit" aria-label="Send">
            <SendHorizontalIcon />
          </button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <button className="send-btn-glass" type="button" aria-label="Cancel">
            <CircleStopIcon />
          </button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <div className="w-full flex justify-end">
      <MessagePrimitive.Root className="message-bubble max-w-[60%] ml-auto" style={{ alignSelf: 'flex-end', textAlign: 'left' }}>
        <div>
          <MessagePrimitive.Content />
        </div>
        <div className="flex justify-end mt-2">
          <UserActionBar />
        </div>
      </MessagePrimitive.Root>
    </div>
  );
};

const UserActionBar: FC<{ alwaysVisible?: boolean }> = ({ alwaysVisible }) => {
  return (
    <ActionBarPrimitive.Root
      className={cn(
        "flex items-center gap-1",
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy message" variant="ghost" size="sm">
          <CopyIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit message" variant="ghost" size="sm">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />
      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <div className="w-full flex justify-start">
      <MessagePrimitive.Root className="message-bubble max-w-[60%] mr-auto" style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
        <div>
          <MessagePrimitive.Content />
        </div>
        <div className="flex justify-start mt-2">
          <AssistantActionBar />
        </div>
      </MessagePrimitive.Root>
    </div>
  );
};

const AssistantActionBar: FC<{ alwaysVisible?: boolean }> = ({ alwaysVisible }) => {
  return (
    <ActionBarPrimitive.Root
      className={cn(
        "flex items-center gap-1",
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy message" variant="ghost" size="sm">
          <CopyIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Regenerate message" variant="ghost" size="sm">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
      <BranchPicker />
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous" variant="ghost" size="sm">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next" variant="ghost" size="sm">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="M6.79289 1.5C6.79289 1.22386 6.56903 1 6.29289 1C6.01675 1 5.79289 1.22386 5.79289 1.5V6.5C5.79289 6.77614 6.01675 7 6.29289 7H11.2929C11.569 7 11.7929 6.77614 11.7929 6.5C11.7929 6.22386 11.569 6 11.2929 6H6.79289V1.5ZM1.14645 8.14645C1.34171 7.95118 1.65829 7.95118 1.85355 8.14645L8.85355 15.1464C9.04882 15.3417 9.04882 15.6583 8.85355 15.8536C8.65829 16.0488 8.34171 16.0488 8.14645 15.8536L1.14645 8.85355C0.951184 8.65829 0.951184 8.34171 1.14645 8.14645Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};
