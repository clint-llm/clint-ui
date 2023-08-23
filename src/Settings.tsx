import { Edit, KeyboardReturn } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Alert } from "./Alerts";

function obfuscateOpenAiKey(key: string): string {
  return key.slice(0, 3) + "•".repeat(key.length - 7) + key.slice(-4);
}

export interface SettingsProps {
  currentOpenAiKey?: string;
  setOpenAiKey(key: string): void;
}

export function Settings(props: SettingsProps) {
  const [openAiKey, setOpenAiKey] = useState<string>(
    props.currentOpenAiKey ?? "",
  );
  const [editMode, setEditMode] = useState<boolean>(true);

  useEffect(() => {
    setOpenAiKey(props.currentOpenAiKey ?? "");
    if (!!props.currentOpenAiKey) setEditMode(false);
  }, [props.currentOpenAiKey]);

  return (
    <form>
      <div className="my-2">
        <label
          htmlFor="openAiKey"
          className="my-2 block text-sm font-medium text-gray-900"
        >
          OpenAI Key
        </label>
        <div
          className={`
              block
              rounded-md
              ring-1
              ring-inset
              ring-gray-300
              focus-within:ring-2
              focus-within:ring-inset
              focus-within:ring-indigo-600
            `}
        >
          <div className="relative">
            {editMode ? (
              <input
                type="text"
                name="openAiKey"
                id="openAiKey"
                onChange={(event) => setOpenAiKey(event.target.value)}
                value={openAiKey}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" || event.shiftKey) return;
                  event.preventDefault();
                  props.setOpenAiKey(openAiKey);
                  setEditMode(!openAiKey);
                }}
                placeholder="OpenAI key"
                className={`
                  block
                  w-full
                  resize-none
                  border-0
                  bg-transparent
                  pl-4
                  pr-[3rem]
                  text-gray-900
                  placeholder:text-gray-300
                  focus:ring-0
                `}
              />
            ) : (
              <input
                type="text"
                name="message"
                id="message"
                value={obfuscateOpenAiKey(openAiKey)}
                disabled={true}
                placeholder="OpenAI key"
                className={`
                  block
                  w-full
                  resize-none
                  border-0
                  bg-transparent
                  pl-4
                  pr-[3rem]
                  text-gray-300
                  placeholder:text-gray-300
                  focus:ring-0
                `}
              />
            )}
            {editMode ? (
              <button
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  props.setOpenAiKey(openAiKey);
                  setEditMode(!openAiKey);
                }}
                className={`
                  bottom
                  absolute
                  right-0
                  -mt-2
                  mr-4
                  h-[1.5em]
                  -translate-y-full
                  transition
                  focus:outline-none
                  enabled:text-indigo-500
                `}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <KeyboardReturn
                    style={{ height: "1em", padding: "0.125em" }}
                  />
                </div>
              </button>
            ) : (
              <button
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  setEditMode(true);
                }}
                className={`
                  bottom
                  absolute
                  right-0
                  -mt-2
                  mr-4
                  h-[1.5em]
                  -translate-y-full
                  transition
                  focus:outline-none
                  enabled:text-indigo-500
                `}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <Edit style={{ height: "1em", padding: "0.125em" }} />
                </div>
              </button>
            )}
          </div>
        </div>
        <div className="my-4">
          {props.currentOpenAiKey ? null : (
            <Alert id="" level="Info">
              Clint uses OpenAI's ChatGPT to process your messages. You must
              provide access to ChatGPT using your own OpenAI developer account
              to use Clint. Visit{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
              >
                OpenAI
              </a>{" "}
              to create an API Key.
            </Alert>
          )}
        </div>
      </div>
    </form>
  );
}
