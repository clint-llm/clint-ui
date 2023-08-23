import { Person } from "@mui/icons-material";
import { Logo } from "./Logo";

import { ChatUiState } from "./utils";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";

export interface ChatHistoryMessage {
  role: "assistant" | "user";
  content: string;
}

export interface ChatHistoryProps {
  history: ChatHistoryMessage[];
  chatUiState: ChatUiState;
}

function RenderResponse(props: { text: string }) {
  return <Markdown>{props.text}</Markdown>;
}

function chatUiStateToMessage(uiState: ChatUiState) {
  switch (uiState) {
    case "load":
      return "Loading resources";
    case "notes":
      return "Taking notes";
    case "diagnosis":
      return "Looking up diagnoses";
    case "refineDiagnosis":
      return "Refining the diagnoses";
    case "respond":
      return "Responding";
    case "cite":
      return "Linking to references";
  }
}

/**
 * Renders the chat history as a list of text boxes with the user and assistant
 * icons and message contents.
 */
export function ChatHistory(props: ChatHistoryProps) {
  return (
    <div className="contain-my">
      {props.history
        .filter((message) => !!message.content)
        .map((message, idx) => (
          <div
            key={idx}
            className={clsx(
              "my-3",
              "block",
              "rounded-md",
              "px-3",
              "py-2",
              "shadow-sm",
              "ring-1",
              "ring-inset",
              "ring-gray-300",
              message.role === "assistant" && ["bg-gray-100", "ring-gray-300"],
              message.role === "user" && ["bg-indigo-100", "ring-indigo-300"],
            )}
          >
            <div className="items-top flex gap-2">
              {message.role === "assistant" ? (
                <Logo
                  className="flex-none text-gray-600"
                  style={{ height: "1em", padding: "0.125em" }}
                />
              ) : (
                <Person
                  className="flex-none text-indigo-600"
                  style={{ height: "1em", padding: "0.125em" }}
                />
              )}
              <div className="space-y-3">
                <RenderResponse text={message.content} />
              </div>
            </div>
          </div>
        ))}
      {props.chatUiState !== "ready" ? (
        <div
          className={clsx(
            "my-3 block rounded-md px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300",
            "bg-gray-100 ring-gray-300",
          )}
        >
          <div className="items-top flex">
            <svg
              aria-hidden="true"
              className="my-[0.25em] mr-2 h-[1em] w-[1em] flex-none animate-spin fill-gray-300 text-indigo-600"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask id="mask">
                <rect x={0} y={0} width={32} height={32} fill="white" />
                <circle cx={16} cy={16} r={12} fill="black" />
              </mask>
              <circle
                cx={16}
                cy={16}
                r={16}
                fill="currentFill"
                mask="url(#mask)"
              />
              <path
                d="M 2 14 A 14 14 0 0 0 14 30"
                stroke="currentColor"
                strokeWidth={4}
                fill="none"
              />
            </svg>
            <div className="flex space-y-3">
              {chatUiStateToMessage(props.chatUiState)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
