import { ChatUiState } from "./utils";

import * as Clint from "../../clint-lib/pkg";

export interface HandleMessageArgs {
  message: string;
  state: Clint.StateJs;
  db: Clint.DocDbJs;
  key: string;
  setChatUiState: (chatUiState: ChatUiState) => void;
  setStatement: (statement: string) => void;
  setNotes: (notes: string) => void;
  setDiagnoses: (diagnoses: string) => void;
  handleResponse: (response: string) => void;
  addError: (message: string) => void;
}

/**
 * Coordinate between the UI and library state when a new message is sent.
 */
export async function handleMessage(
  args: HandleMessageArgs,
): Promise<Clint.StateJs> {
  const {
    message,
    state,
    db,
    key,
    setChatUiState,
    setStatement,
    setNotes,
    setDiagnoses,
    handleResponse,
    addError,
  } = args;

  let newState = state;

  const markdownDepth = 3;
  const errorMessage =
    "Please try again, and change your message if the problem persists.";

  // UI is now taking notes from the message
  setChatUiState("notes");

  // Translate the user message into a 3rd person medical statement
  let statement = undefined;
  {
    let parts = undefined;
    try {
      parts = await Clint.rewrite_message_js(message, key);
    } catch (err) {
      addError(`Error: ${err} ${errorMessage}`);
      throw err;
    }
    // Stream the response
    while (true) {
      let x = undefined;
      try {
        x = await parts.next();
      } catch (err) {
        addError(`Error: ${err} ${errorMessage}`);
        throw err;
      }
      if (x == undefined) break;
      statement = x;
      setStatement(statement);
    }
  }
  // Don't proceed if no statement is generated
  if (statement == undefined) return newState;
  // Update the state, this statement is used to generate notes
  newState.set_statement(statement);

  // Remember previous notes to determine if any new information was added
  const prevNotes = newState.notes_to_markdown(markdownDepth);
  try {
    newState = await Clint.create_notes_js(newState, key);
  } catch (err) {
    addError(`Error: ${err} ${errorMessage}`);
    throw err;
  }
  const notes = newState.notes_to_markdown(markdownDepth);
  if (notes !== prevNotes) setNotes(notes);

  // If the notes changed, update the diagnosis
  let diagnosis = undefined;
  if (notes !== prevNotes) {
    setChatUiState("diagnosis");

    try {
      newState = await Clint.initial_diagnosis_js(newState, db, key);
    } catch (err) {
      addError(`Error: ${err} ${errorMessage}`);
      throw err;
    }

    // Ask GPT for per-diagnosis assessments
    setChatUiState("refineDiagnosis");

    try {
      newState = await Clint.refine_diagnosis_js(newState, db, key);
    } catch (err) {
      addError(`Error: ${err} ${errorMessage}`);
      throw err;
    }

    diagnosis = newState.diagnoses_to_markdown(markdownDepth);
    setDiagnoses(diagnosis);
  }

  // Respond to the last message and address any changes in diagnoses
  setChatUiState("respond");

  let response = undefined;
  {
    let parts = undefined;
    try {
      parts = await Clint.respond_js(newState, message, !!diagnosis, db, key);
    } catch (err) {
      addError(`Error: ${err} ${errorMessage}`);
      throw err;
    }
    while (parts != undefined) {
      let x = undefined;
      try {
        x = await parts.next();
      } catch (err) {
        addError(`Error: ${err} ${errorMessage}`);
        throw err;
      }
      if (x == undefined) break;
      response = x;
      handleResponse(response);
    }
  }

  // Update the state with the response _excluding_ citations
  newState.add_user_message(message);
  if (response != undefined) newState.add_assistant_message(response);

  // If there is diagnosis information, cite sources
  if (diagnosis !== undefined) {
    setChatUiState("cite");

    if (response != undefined) {
      let citations = undefined;
      try {
        citations = await Clint.cite_js(response, db, key);
      } catch (err) {
        addError(`Error: ${err} ${errorMessage}`);
        throw err;
      }
      if (citations != undefined) {
        response += "\n\n" + citations;
        handleResponse(response);
      }
    }
  }

  return newState;
}
