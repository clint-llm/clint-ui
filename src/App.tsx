import { Navigation } from "./Navigation";
import { MessageForm, MessageFormProps } from "./MessageForm";
import {
  ChatHistory,
  ChatHistoryMessage,
  ChatHistoryProps,
} from "./ChatHistory";
import { ChatUiState } from "./utils";
import { Details, DetailsProps } from "./Details";

import * as Clint from "../../clint-lib/pkg";
import { ReactNode, useEffect, useState } from "react";
import { buildDocDb } from "./DocDb";
import {
  AlertLevel,
  AlertProps,
  Alerts,
  AlertsProps,
  newAlert,
} from "./Alerts";
import { Settings, SettingsProps } from "./Settings";
import { handleMessage } from "./controllers";
import { Example } from "./Example";

/**
 * Get a value from storage with a deserializer, or undefined if the key
 * is not present.
 */
function getFromStorage<T>(
  key: string,
  storage: Storage,
  deserializer: (x: string) => T = JSON.parse,
): T | undefined {
  const serialized = storage.getItem(key);
  if (serialized == undefined) return undefined;
  return deserializer(serialized);
}

interface TermsProps {
  setTermsOfUseOk: (x: boolean) => void;
}

const disclaimer = (
  <>
    Clint, a proof-of-concept tool, is not always accurate or reliable, and
    should not replace medical professionals. Any information given by Clint
    should not be used for diagnosing or treating health issues. Don't ignore or
    delay professional medical advice due to Clint.
  </>
);

const about = (
  <>
    <p>
      Clint is an open-sourced medical information lookup and reasoning tool.
    </p>

    <p>
      Clint enables a user to have an interactive dialogue about medical
      conditions, symptoms, or simply to ask medical questions. Clint helps
      connect regular health concerns with complex medical information. It does
      this by converting colloquial language into medical terms, gathering and
      understanding information from medical resources, and presenting this
      information back to the user in an easy-to-understand way.
    </p>

    <p>
      One of the key features of Clint is that its processing is local. It's
      served using GitHub pages and utilizes the user's OpenAI API key to make
      requests to directly to GPT. All processing, except for that done by the
      LLM, happens in the user's browser.
    </p>

    <p className="font-medium">{disclaimer}</p>
  </>
);

const clearState = (
  <button
    className={`
    rounded-md
    bg-indigo-600
    px-3
    py-2
    text-sm
    font-semibold
    text-white
    transition
    hover:bg-indigo-500
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-indigo-600
  `}
    onClick={(event) => {
      event.preventDefault();
      sessionStorage.clear();
      location.reload();
    }}
  >
    Clear Session
  </button>
);

function Terms(props: TermsProps) {
  return (
    <>
      <span className="font-medium">Terms of Use</span>
      <p>{disclaimer}</p>
      <p>
        THE SITE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
        THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
        OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
        ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        OTHER DEALINGS IN THE SOFTWARE.
      </p>
      <p>
        BY USING THE SITE, YOU AGREE TO THESE TERMS OF USE. IF YOU DON'T AGREE,
        DON'T USE THE SITE.
      </p>
      <p>
        <button
          className={`
          rounded-md
          bg-indigo-600
          px-3
          py-2
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-indigo-500
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-indigo-600
        `}
          onClick={(event) => {
            event.preventDefault();
            props.setTermsOfUseOk(true);
          }}
        >
          Acknowledge
        </button>
      </p>
    </>
  );
}

/**
 * The single-page application.
 */
function App() {
  // Access to the medical document database
  const [db, setDb] = useState<Clint.DocDbJs | undefined>(undefined);
  // The current state (conversation history, notes, etc.) maintained by the
  // library
  const [state, setState] = useState<Clint.StateJs>(
    getFromStorage("state", sessionStorage, (x) =>
      Clint.StateJs.from_string(x),
    ) ?? new Clint.StateJs(),
  );
  // The current conversation history for displaying
  const [history, setHistory] = useState<ChatHistoryMessage[]>(
    getFromStorage("history", sessionStorage) ?? [],
  );
  // The current statement (user message in 3rd person medical language)
  const [statement, setStatement] = useState<string | undefined>(
    getFromStorage("statement", sessionStorage),
  );
  // The clinical notes derived from the conversation
  const [notes, setNotes] = useState<string | undefined>(
    getFromStorage("notes", sessionStorage),
  );
  // Candidate diagnoses derived from the notes
  const [diagnoses, setDiagnoses] = useState<string | undefined>(
    getFromStorage("diagnoses", sessionStorage),
  );
  const [termsOfUseOk, setTermsOfUseOk] = useState<boolean>(
    getFromStorage("termsOfUseOk", localStorage) ?? false,
  );
  // UI state affects loading messages
  const [chatUiState, setChatUiState] = useState<ChatUiState>("load");
  const [openAiKey, setOpenAiKey] = useState<string>(
    getFromStorage("openAiKey", localStorage) ?? "",
  );
  // List of alerts to display below the message form
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  // Store state in session storage or local storage
  useEffect(() => {
    sessionStorage.setItem("state", state.to_string());
  }, [state]);
  // Don't want the history to be remembered after closing the browser
  useEffect(() => {
    sessionStorage.setItem("history", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    if (statement == undefined) sessionStorage.removeItem("statement");
    else sessionStorage.setItem("statement", JSON.stringify(statement));
  }, [statement]);
  useEffect(() => {
    if (notes == undefined) sessionStorage.removeItem("notes");
    else sessionStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    if (diagnoses == undefined) sessionStorage.removeItem("diagnoses");
    else sessionStorage.setItem("diagnoses", JSON.stringify(diagnoses));
  }, [diagnoses]);
  // Persist acknowledged terms between sessions
  useEffect(() => {
    if (termsOfUseOk == undefined) localStorage.removeItem("termsOfUseOk");
    else localStorage.setItem("termsOfUseOk", JSON.stringify(termsOfUseOk));
  }, [termsOfUseOk]);
  // Persist OpenAI API key between sessions
  useEffect(() => {
    if (openAiKey == undefined) localStorage.removeItem("openAiKey");
    else localStorage.setItem("openAiKey", JSON.stringify(openAiKey));
  }, [openAiKey]);

  // First-time setup
  useEffect(() => {
    buildDocDb()
      .then(setDb)
      // Once DB is available UI is ready
      .then(() => setChatUiState("ready"))
      .catch((x) => console.error(x));
    // Always show the price warning
    addAlert(
      <>
        Every message you send makes requests to ChatGPT using your OpenAI
        account. Several thousand tokens to are transmitted to{" "}
        <code>gpt-4o</code>. Your OpenAI account is billed according to{" "}
        <a href="https://openai.com/pricing">OpenAI's Pricing</a>, and each
        message can cost you a few cents.
      </>,
      "Warning",
    );
    // And always show the privacy warning
    addAlert(
      <>
        The contents the message are sent to OpenAI and subject to{" "}
        <a href="https://openai.com/policies/privacy-policy">
          OpenAI's Privacy Policy
        </a>
        .
      </>,
      "Warning",
    );
  }, []);

  // Error if there is no OpenAI API key
  useEffect(() => {
    const alertMessage = "You must provide an OpenAI API key";
    if (!!openAiKey) {
      removeAlert(newAlert(alertMessage, "Error").id);
    } else {
      addAlert(alertMessage, "Error");
    }
  }, [openAiKey]);

  // Error of terms are not acknowledged
  useEffect(() => {
    const alertMessage = "You must acknowledge the Terms of Use.";
    if (!!termsOfUseOk) {
      removeAlert(newAlert(alertMessage, "Error").id);
    } else {
      addAlert(alertMessage, "Error");
    }
  }, [termsOfUseOk]);

  // Remove alerts when they are closed
  function removeAlert(id: string) {
    setAlerts((alerts) => alerts.filter((x) => x.id != id));
  }

  // Add alert using its contents as its ID (same alert won't be added twice)
  function addAlert(message: ReactNode, level: AlertLevel) {
    const alert = newAlert(message, level, removeAlert);
    setAlerts((alerts) => {
      if (alerts.find((x) => x.id === alert.id) != undefined) return alerts;
      else return [...alerts, alert];
    });
  }

  async function sendMessage(message: string) {
    // DB must be available
    if (db == undefined) return;
    // Show the new message in the history, and prepare a blank message that
    // will be filled as the assistant responds
    setHistory((history) => [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    try {
      // Get the new state from the library and trigger UI effects
      const newState = await handleMessage({
        message,
        state,
        db,
        key: openAiKey,
        setChatUiState,
        setStatement,
        setNotes,
        setDiagnoses,
        handleResponse: (response) => {
          setHistory((history) => [
            ...history.slice(0, -1),
            { role: "assistant", content: response },
          ]);
        },
        addError: (message) => addAlert(message, "Error"),
      });
      if (newState != undefined) setState(newState);
    } catch (err) {
      // Remove the user message and any partial response since the state isn't
      // updated with the response and/or the response didn't finish
      setHistory((history) => history.slice(0, -2));
      throw err;
    } finally {
      // Once the response is done or aborted the UI is ready for another message
      setChatUiState("ready");
    }
  }

  const chatHistoryProps: ChatHistoryProps = {
    history,
    chatUiState,
  };

  const messageFormProps: MessageFormProps = {
    ready: db != undefined && chatUiState == "ready" && termsOfUseOk,
    sendMessage: db != undefined && openAiKey ? sendMessage : undefined,
  };

  const detailsProps: DetailsProps = {
    statement,
    notes,
    diagnoses,
  };

  const errorMessagesProps: AlertsProps = {
    alerts,
  };

  const settingsProps: SettingsProps = {
    currentOpenAiKey: openAiKey,
    setOpenAiKey,
  };

  const termsProps: TermsProps = {
    setTermsOfUseOk,
  };

  return (
    <>
      <div className="min-h-full scroll-smooth">
        <Navigation />
        <header className="bg-white">
          <div className="mx-auto mb-6 max-w-4xl px-4">
            <h1>Clint</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-4xl px-4 pb-6">
            {termsOfUseOk ? null : (
              <div className="my-4">
                <div className="contain-my rounded-md border border-gray-300 bg-gray-100 px-4 py-2">
                  <Terms {...termsProps} />
                </div>
              </div>
            )}
            <h2 id="chat">Chat</h2>
            <div className="my-4">
              <Settings {...settingsProps} />
            </div>
            <div className="my-4">
              <ChatHistory {...chatHistoryProps} />
            </div>
            <div className="my=4">
              <MessageForm {...messageFormProps} />
            </div>
            <div className="my-4">
              <Alerts {...errorMessagesProps} />
            </div>
            <div className="my-4">{clearState}</div>
            <div className="my-4">
              <Details {...detailsProps} />
            </div>
            <div className="my-4">
              <h2 id="about">About</h2>
              {about}
              <div className="my-4">
                <Example />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
