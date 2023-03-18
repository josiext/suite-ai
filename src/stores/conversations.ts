import { create } from "zustand";
import { APIS } from "@/config/consts";

export const useConversationsStore = create((set, get) => ({
  code: null,
  streaming: false,
  prompt: "",
  setPrompt: (prompt: string) => {
    set({ code: null, prompt });
  },

  generateComponent: async ({ prompt }: any) => {
    set({ streaming: true });

    const url = `${APIS.GENERATE}?prompt=${prompt}`;

    const eventSource = new EventSource(url);
    let code = "";

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

      code += JSON.parse(data);
      set(() => ({ code }));
    };
  },
}));
