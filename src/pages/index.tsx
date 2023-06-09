import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Text, Button, Input, Navbar } from "@suit-ui/react";
import { useEffect, useRef } from "react";
import { useConversationsStore } from "@/stores/conversations";
import Preview from "@/components/Preview";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const setPrompt = useConversationsStore((state: any) => state.setPrompt);
  const prompt = useConversationsStore((state: any) => state.prompt);
  const streaming = useConversationsStore((state: any) => state.streaming);

  const generateResponse = useConversationsStore(
    (state: any) => state.generateResponse
  );

  async function handleSubmit(event: any) {
    event.preventDefault();
    generateResponse({ prompt });
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>Suite AI</title>
        <meta name="description" content="Suite AI app powered by Chat GPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Box className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
          <Text as="h1" className="text-3xl font-bold">
            Bienvenido a Legal AI
          </Text>

          <Text className=" text-neutral-400">
            Consulta aquí por la informacion o estado de tus proyectos.
          </Text>

          <form onSubmit={handleSubmit}>
            <Box className="flex  gap-4">
              <Input
                value={prompt}
                onChange={(event) => {
                  const { value } = event.target;
                  setPrompt(value);
                }}
                disabled={streaming}
                ref={inputRef}
                autoFocus
                placeholder="Que proyectos tenemos?"
                name="prompt"
                type="text"
                className={`resize-none pr-10 ${
                  streaming ? "opacity-40 pointer-events-none" : ""
                } placeholder-white/30 rounded-2xl block w-[600px] text-md px-6 text-xl py-4 border border-zinc-600 bg-white/5 backdrop-blur-3xl sm:text-md shadow-lg text-white outline-none overflow-hidden transition ring-white/40 focus:ring-2`}
              />
              <Button type="submit">Enviar</Button>
            </Box>
          </form>
          <Preview />
        </Box>
      </Box>
    </>
  );
}
