import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

export const ThinkingSpinner = () => (
  <Box>
    <Text color="yellow">
      <Spinner type="dots" /> Thinking...
    </Text>
  </Box>
);
