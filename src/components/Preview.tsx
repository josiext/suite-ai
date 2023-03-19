import { useConversationsStore } from "@/stores/conversations";
import { Box, Text } from "@suit-ui/react";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import remarkGfm from "remark-gfm";

export default function Preview() {
  const { response } = useConversationsStore(({ response }: any) => ({
    response,
  }));

  return (
    <Box className="max-w-[800px] bg-neutral-100 p-4 rounded-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{`${response}`}</ReactMarkdown>
    </Box>
  );
}
