import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

interface PlanViewProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
}

export const PlanView = ({ input, setInput, onSubmit }: PlanViewProps) => (
  <Box flexDirection="column" padding={1}>
    <Text bold>What is your goal?</Text>
    <Box borderStyle="round" borderColor="cyan" paddingX={1} marginTop={1}>
      <TextInput
        value={input}
        onChange={setInput}
        onSubmit={onSubmit}
        placeholder="e.g., create a new react app..."
      />
    </Box>
    <Text color="gray" marginTop={1}>
      (Press Enter to submit)
    </Text>
  </Box>
);
