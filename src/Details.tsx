import { Disclosure, Transition } from "@headlessui/react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface PanelProps {
  title?: string;
  children: ReactNode;
}

function Panel(props: PanelProps) {
  return (
    <div className="my-4 rounded-md border border-gray-300">
      {props.title ? (
        <div className="rounded-t-md bg-gray-100 px-4 py-2 text-sm font-semibold">
          <span className="text-gray-900">{props.title}</span>
        </div>
      ) : null}
      <div className="px-4 py-2">{props.children}</div>
    </div>
  );
}

export interface DetailsProps {
  statement?: string;
  notes?: string;
  diagnoses?: string;
}

/**
 * Show notes and diagnoses in a disclosure.
 */
export function Details(props: DetailsProps) {
  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`
          flex
          w-full
          items-center
          justify-between
          rounded-md
          border
          border-gray-300
          bg-gray-100
          px-4
          py-2
          text-gray-900
          focus:outline-none
        `}
          >
            <span className="text-sm font-semibold">Notes and Reasoning</span>
            {open ? (
              <ExpandLess className="block" style={{ height: "1em" }} />
            ) : (
              <ExpandMore className="block" style={{ height: "1em" }} />
            )}
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <Disclosure.Panel>
              <div>
                {!props.statement && !props.notes && !props.diagnoses ? (
                  <Panel>There are no conversation notes.</Panel>
                ) : null}
                {props.statement ? (
                  <Panel title="Patient statement">
                    <div className="contain-my">
                      <ReactMarkdown>{props.statement}</ReactMarkdown>
                    </div>
                  </Panel>
                ) : null}
                {props.notes ? (
                  <Panel title="Notes">
                    <div className="contain-my">
                      <ReactMarkdown>{props.notes}</ReactMarkdown>
                    </div>
                  </Panel>
                ) : null}
                {props.diagnoses ? (
                  <Panel title="Reasoning">
                    <div className="contain-my">
                      <ReactMarkdown>{props.diagnoses}</ReactMarkdown>
                    </div>
                  </Panel>
                ) : null}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
