import { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: string;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Ascunde notificarea după 5 secunde
      return () => clearTimeout(timeoutId);
    }
  }, [message]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 right-0 p-4 text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } transition-transform transform max-h-full overflow-hidden translate-y-0 duration-200 ease-in-out z-50`}
    >
      {message}
    </div>
  );
};
