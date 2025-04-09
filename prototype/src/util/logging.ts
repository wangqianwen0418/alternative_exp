import { useAtom } from "jotai";
import { uuidAtom } from "../store";
import { logging_weburl } from "../util/appscript_url";

export function useLogging() {
  const [uuid] = useAtom(uuidAtom);

  return async (logType: string, description: string) => {
    const data = {
      uuid,
      timestamp: new Date().toLocaleString(),
      logType: logType,
      description: description
    };

    try {
      await fetch(logging_weburl!, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error logging timestamp:", error);
    }
  };
}
