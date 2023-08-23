import { Error, Close, Warning, Info } from "@mui/icons-material";
import { CSSProperties, ReactNode } from "react";
import reactNodeToString from "react-node-to-string";

export type AlertLevel = "Error" | "Warning" | "Info";

function AlertLevelIcon(props: {
  level: AlertLevel;
  className?: string;
  style?: CSSProperties;
}) {
  switch (props.level) {
    case "Error":
      return <Error className={props.className} style={props.style} />;
    case "Warning":
      return <Warning className={props.className} style={props.style} />;
    case "Info":
      return <Info className={props.className} style={props.style} />;
    default:
      return null;
  }
}

function alertLevelColors(level: AlertLevel): {
  textColor: string;
  bgColor: string;
  iconColor: string;
} {
  switch (level) {
    case "Error":
      return {
        textColor: "text-red-800",
        bgColor: "bg-red-100",
        iconColor: "text-red-400",
      };
    case "Warning":
      return {
        textColor: "text-amber-800",
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      };
    case "Info":
      return {
        textColor: "text-blue-800",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-400",
      };
  }
}

/**
 * Build a new `Alert` component from a message and a level.
 *
 * Sets the `id` prop to the stringified version of the message. Using this,
 * two messages in the same list won't be duplicated.
 *
 * @param message the message to show
 * @param level the alert level
 * @param removeAlert callback that removes just this alert
 */
export function newAlert(
  message: ReactNode,
  level: AlertLevel,
  removeAlert?: (id: string) => void,
): AlertProps {
  const id = reactNodeToString(message);
  return {
    id,
    level,
    children: message,
    remove: removeAlert ? () => removeAlert(id) : undefined,
  };
}

export interface AlertProps {
  // the id is used to identify the alert for removal and to avoid duplicates
  id: string;
  // the level determines which icon and color is used to render the alert
  level: AlertLevel;
  // if undefined, the alert will not have a close button
  remove?: () => void;
  // pass styles through to the alert container
  style?: CSSProperties;
  // the alert message
  children?: ReactNode;
}

/**
 * Alert box with an icon and a close button.
 */
export function Alert(props: AlertProps) {
  const { textColor, bgColor, iconColor } = alertLevelColors(props.level);
  return (
    <div
      className={`contain-my my-2 flex items-center gap-2 rounded-md ${bgColor} px-4 py-2`}
      style={props.style}
    >
      <div className={`flex-none ${iconColor}`}>
        <AlertLevelIcon level={props.level} style={{ height: "1em" }} />
      </div>
      <div className="grow">
        <div className={textColor}>{props.children}</div>
      </div>
      {props.remove ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            if (props.remove) props.remove();
          }}
          className={`${textColor} focus:outline-none`}
        >
          <Close style={{ height: "1em", padding: "0.125em" }} />
        </button>
      ) : null}
    </div>
  );
}

export interface AlertsProps {
  alerts: AlertProps[];
}

/**
 * List of alerts.
 */
export function Alerts(props: AlertsProps) {
  return (
    <ul>
      {props.alerts.map((alert, i) => (
        <li className="list-none" key={i}>
          <Alert {...alert} />
        </li>
      ))}
    </ul>
  );
}
