import { useConversationsStore } from "@/stores/conversations";
import { Text } from "@suit-ui/react";

export default function Preview() {
  const { code } = useConversationsStore(({ code }: any) => ({ code }));

  return (
    <div>
      <Text>{code}</Text>
    </div>
  );
}
