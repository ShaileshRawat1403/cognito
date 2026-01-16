import React from "react";
import { Box, Text } from "ink";
import type { RoadmapStep } from "./types.ts";

interface BuildViewProps {
  roadmap: RoadmapStep[];
  focusedStep: number;
}

export const BuildView = ({ roadmap, focusedStep }: BuildViewProps) => (
  <Box flexDirection="column" padding={1}>
    <Text bold>Thought Sequence (Roadmap)</Text>
    <Text color="gray">
      Use Up/Down arrows to select a step. Press Enter to execute.
    </Text>
    {roadmap.map((step, idx) => {
      const isFocused = focusedStep === idx;
      let color: "white" | "green" | "yellow" | "cyan" | "red" = "white";
      let indicator = " ";

      if (step.status === "completed") {
        color = "green";
        indicator = "✅";
      } else if (step.status === "executing") {
        color = "yellow";
        indicator = "⏳";
      } else if (step.status === "failed") {
        color = "red";
        indicator = "❌";
      } else if (isFocused) {
        color = "cyan";
        indicator = "➡️";
      }

      return (
        <Box key={step.id} flexDirection="column" marginTop={1}>
          <Text color={color}>{`${indicator} ${step.title}`}</Text>
          <Text color="gray">{`   └── Command: \`${step.cmd}\``}</Text>
        </Box>
      );
    })}
  </Box>
);
