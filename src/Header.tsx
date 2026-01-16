import React from "react";
import { Box, Text } from "ink";

interface HeaderProps {
  activeMode: "plan" | "build";
  autoRun: boolean;
}

export const Header = ({ activeMode, autoRun }: HeaderProps) => (
  <Box
    borderBottom
    borderStyle="round"
    paddingX={1}
    justifyContent="space-between"
  >
    <Text bold color="cyan">
      🧠 Cogito
    </Text>
    <Box>
      <Text color={activeMode === "plan" ? "blue" : "gray"}> PLAN (p) </Text>
      <Text color={activeMode === "build" ? "green" : "gray"}> BUILD (b) </Text>
      <Text color={autoRun ? "magenta" : "gray"}>
        {" "}
        AUTORUN (a): {autoRun ? "ON" : "OFF"}{" "}
      </Text>
    </Box>
  </Box>
);
