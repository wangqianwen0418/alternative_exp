import { useAtom } from "jotai";
import { uuidAtom } from "../store";
import { test_logging_weburl } from "../util/appscript_url";

export function useLogging() {
  const [uuid] = useAtom(uuidAtom);

  return async (logType: string, description: string, second_graph_type?: string) => {
    const data = {
      uuid,
      timestamp: new Date().toLocaleString(),
      log_type: logType,
      description: description,
      second_graph_type: second_graph_type ? second_graph_type : "N/A"
    };

    try {
      await fetch(test_logging_weburl!, {
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
