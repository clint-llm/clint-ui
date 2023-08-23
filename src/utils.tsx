export type ChatUiState =
  | "load"
  | "ready"
  | "notes"
  | "diagnosis"
  | "refineDiagnosis"
  | "respond"
  | "cite";

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
