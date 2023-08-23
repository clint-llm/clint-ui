import { Disclosure, Transition } from "@headlessui/react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

/**
 * A disclosure panel containing an example usage of Clint.
 *
 * There is nothing dynamic in this component, but given the dynamic nature of
 * the `Disclosure` component it is separated out into its own component to
 * reduce the complexity of the `App` component.
 */
export function Example() {
  return (
    <Disclosure>
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
            <span className="text-sm font-semibold">Example</span>
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
              <div className="contain-my my-4 rounded-md border border-gray-300 p-4">
                <p>
                  The following example is derived from a sample US Medical
                  Licensing Examination question about a patient with a history
                  of smoking who suffers from Emphysema. Clint is able to list
                  plausible diagnoses and ask the right questions to get narrow
                  down the diagnosis.
                </p>

                <figure className="my-4 p-4">
                  <img
                    src="/images/symptoms.png"
                    alt="Clint symptoms"
                    className="h-auto w-full"
                  />
                  <figcaption className="mt-2 text-center text-sm text-gray-500">
                    Clint responds to messages about symptoms.
                  </figcaption>
                </figure>

                <figure className="my-4 p-4">
                  <img
                    src="/images/followup.png"
                    alt="Clint follow-up"
                    className="h-auto w-full"
                  />
                  <figcaption className="mt-2 text-center text-sm text-gray-500">
                    Clint asks follow-up questions.
                  </figcaption>
                </figure>

                <figure className="my-4 p-4">
                  <img
                    src="/images/notes.png"
                    alt="Clint notes"
                    className="h-auto w-full"
                  />
                  <figcaption className="mt-2 text-center text-sm text-gray-500">
                    Clint takes clinical notes.
                  </figcaption>
                </figure>

                <figure className="my-4 p-4">
                  <img
                    src="/images/reasoning.png"
                    alt="Clint reasoning"
                    className="h-auto w-full"
                  />
                  <figcaption className="mt-2 text-center text-sm text-gray-500">
                    Clint reasons about possible diagnoses.
                  </figcaption>
                </figure>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
