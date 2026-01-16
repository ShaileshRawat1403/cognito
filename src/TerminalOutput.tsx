import React from "react";
import { Box, Text } from "ink";

interface TerminalOutputProps {
  lines: string[];
}

export const TerminalOutput = ({ lines }: TerminalOutputProps) => (
  <Box flexDirection="column" borderTop borderStyle="round" paddingX={1}>
    <Text bold>Interactive Feed</Text>
    <Box flexDirection="column" height={5}>
      {lines.slice(-5).map((line, i) => (
        <Text key={i} color="gray">
          {line}
        </Text>
      ))}
    </Box>
  </Box>
);
