import { Send } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export interface MessageFormProps {
  ready: boolean;
  message?: string;
  sendMessage?: (message: string) => Promise<void>;
}

/**
 * Text box to send messages.
 */
export function MessageForm(props: MessageFormProps) {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setMessage(props.message ?? "");
  }, [props.message]);

  return (
    <form>
      <div
        className={`
              block
              rounded-md
              shadow-md
              ring-1
              ring-inset
              ring-gray-300
              focus-within:ring-2
              focus-within:ring-inset
              focus-within:ring-indigo-600
            `}
      >
        <div className="relative">
          <TextareaAutosize
            name="message"
            id="message"
            rows={1}
            onChange={(event) => setMessage(event.target.value)}
            value={message}
            disabled={!props.sendMessage || !props.ready}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              if (!message) return;
              if (props.sendMessage == undefined) return;
              props
                .sendMessage(message)
                .then(() => setMessage(""))
                .catch((x) => console.error(x));
            }}
            placeholder="Message"
            className={`
                  block
                  w-full
                  resize-none
                  border-0
                  bg-transparent
                  pl-4
                  pr-[3rem]
                  text-gray-900
                  placeholder:text-gray-400
                  focus:ring-0
                  disabled:bg-transparent
                  disabled:text-gray-300
                `}
          />
          <button
            type="submit"
            onClick={(event) => {
              event.preventDefault();
              if (!message) return;
              if (props.sendMessage == undefined) return;
              props.sendMessage(message);
              setMessage("");
            }}
            disabled={!message || !props.sendMessage || !props.ready}
            className={`
                  bottom
                  absolute
                  right-0
                  -mt-2
                  mr-4
                  h-[1.5em]
                  w-[1.5em]
                  -translate-y-full
                  rounded-md
                  transition
                  enabled:bg-indigo-600
                  enabled:text-white
                  enabled:shadow-sm
                  enabled:hover:bg-indigo-500
                  enabled:focus-visible:outline
                  enabled:focus-visible:outline-2
                  enabled:focus-visible:outline-offset-2
                  enabled:focus-visible:outline-indigo-600
                  disabled:bg-transparent
                  disabled:text-gray-300
                `}
          >
            <div className="flex h-full w-full items-center justify-center">
              <Send style={{ height: "1em", padding: "0.125em" }} />
            </div>
          </button>
        </div>
      </div>
    </form>
  );
}
