import { create } from "zustand";
import { APIS } from "@/config/consts";

export const useConversationsStore = create((set) => ({
  response: "",
  streaming: false,
  prompt: "",
  setPrompt: (prompt: string) => {
    set({ prompt });
  },

  generateResponse: async ({ prompt }: { prompt: string }) => {
    set({ streaming: true });

    const url = `${APIS.GENERATE}?prompt=${prompt}`;

    const eventSource = new EventSource(url);
    let response = "";

    eventSource.onerror = (error) => {
      console.error(error);
      eventSource.close();
      set(() => ({ streaming: false }));
    };

    eventSource.onmessage = (event) => {
      const { data } = event;

      if (data === "[DONE]") {
        set(() => ({ streaming: false }));

        eventSource.close();
        return;
      }

      response += JSON.parse(data);
      set(() => ({ response }));
    };
  },
}));
