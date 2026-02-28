export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error";
  timestamp: string;
  read: boolean;
}
