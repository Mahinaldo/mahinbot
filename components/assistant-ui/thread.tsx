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
  // SSR-safe sidebar state for input margin
  const [sidebarState, setSidebarState] = useState<'collapsed' | 'expanded'>('collapsed');
  // Only update sidebarState on client
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      try {
        setSidebarState(useSidebar().state);
      } catch {}
    }
  }, []);

  // Hydrate messages from localStorage on mount (fallback: show as system message)
  useEffect(() => {
    const saved = localStorage.getItem("chatloom-thread-messages");
    if (saved && threadRef.current) {
      try {
        const messages = JSON.parse(saved);
        // If the library does not expose setMessages, show as a system message
        if (!threadRef.current.setMessages && messages.length > 0) {
          const container = document.createElement("div");
          container.className = "bg-muted text-foreground rounded-3xl px-5 py-2.5 my-2";
          container.innerText = messages.map((m: any) => m.role + ': ' + m.content).join('\n');
          threadRef.current.appendChild(container);
        }
      } catch {}
    }
  }, []);

  // Save messages to localStorage on every update (fallback: serialize DOM)
  useEffect(() => {
    if (!threadRef.current) return;
    const messageNodes = threadRef.current.querySelectorAll('[data-slot="message-content"]');
    const messages = Array.from(messageNodes).map((node: any) => ({
      role: node.closest('[data-slot="message-root"]').classList.contains('user') ? 'user' : 'assistant',
      content: node.textContent
    }));
    localStorage.setItem("chatloom-thread-messages", JSON.stringify(messages));
  });

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
            <ThreadPrimitive.Viewport className="flex flex-col flex-1 min-h-0 items-center overflow-y-auto scroll-smooth px-4 pt-8 pb-32" style={{ background: 'none' }}>
              <ThreadWelcome />
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
            <div className={`fixed bottom-0 left-0 w-full flex justify-center z-20 mb-6 transition-all duration-300 ${sidebarState === 'expanded' ? 'ml-[12rem]' : ''}`} style={{ pointerEvents: 'auto' }}>
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

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col items-center justify-center">
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
          }}
        >
          <BlurText text="How can I help you today?" delay={120} className="text-3xl md:text-5xl font-bold" animateBy="words" direction="top" />
        </div>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <>
      <ThreadPrimitive.Suggestion prompt="Summarize this text" />
      <ThreadPrimitive.Suggestion prompt="Write a poem about technology" />
      <ThreadPrimitive.Suggestion prompt="Explain quantum computing in simple terms" />
      <ThreadPrimitive.Suggestion prompt="Translate 'Hello, how are you?' to French" />
      <ThreadPrimitive.Suggestion prompt="Generate a JavaScript function to reverse a string" />
    </>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="flex w-full flex-wrap items-end rounded-lg border-none bg-transparent px-2.5 shadow-none transition-colors ease-in">
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
          <UserActionBar alwaysVisible />
        </div>
        <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
      </MessagePrimitive.Root>
    </div>
  );
};

const UserActionBar: FC<{ alwaysVisible?: boolean }> = ({ alwaysVisible }) => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning={false}
      autohide={alwaysVisible ? 'never' : undefined}
      className={"flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5" + (alwaysVisible ? " opacity-100" : "")}
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
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
          <MessagePrimitive.Content components={{ Text: MarkdownText, tools: { Fallback: ToolFallback } }} />
        </div>
        <AssistantActionBar alwaysVisible />
        <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
      </MessagePrimitive.Root>
    </div>
  );
};

const AssistantActionBar: FC<{ alwaysVisible?: boolean }> = ({ alwaysVisible }) => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning={false}
      autohide={alwaysVisible ? 'never' : undefined}
      autohideFloat={alwaysVisible ? 'never' : undefined}
      className={"text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 opacity-100" + (alwaysVisible ? " opacity-100" : "")}
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
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
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
