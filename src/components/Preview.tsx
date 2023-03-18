import { useConversationsStore } from "@/stores/conversations";
import { Box, Text } from "@suit-ui/react";

export default function Preview() {
  const { code } = useConversationsStore(({ code }: any) => ({ code }));

  return (
    <Box className="max-w[400px] bg-neutral-100 p-4 overflow-auto">
      <Text>{code}</Text>
    </Box>
  );
}
