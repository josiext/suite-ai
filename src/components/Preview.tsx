import { useConversationsStore } from "@/stores/conversations";
import { Box, Text } from "@suit-ui/react";

export default function Preview() {
  const { code } = useConversationsStore(({ code }: any) => ({ code }));

  console.log(code);

  return (
    <Box className="max-w-[800px] bg-neutral-100 p-4 rounded-md">
      <Text>{code}</Text>
    </Box>
  );
}
