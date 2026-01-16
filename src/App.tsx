import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import type { RoadmapStep } from "./types.ts";

// --- Inlined `cli-spinners` data ---
const spinners = {
  dots: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
};

// --- Header Component ---
interface HeaderProps {
  activeMode: "plan" | "build";
  autoRun: boolean;
}

const Header = ({ activeMode, autoRun }: HeaderProps) => (
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

// --- PlanView Component ---
interface PlanViewProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
}

const PlanView = ({ input, setInput, onSubmit }: PlanViewProps) => (
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

// --- BuildView Component ---
interface BuildViewProps {
  roadmap: RoadmapStep[];
  focusedStep: number;
}

const BuildView = ({ roadmap, focusedStep }: BuildViewProps) => (
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

// --- TerminalOutput Component ---
interface TerminalOutputProps {
  lines: string[];
}

const TerminalOutput = ({ lines }: TerminalOutputProps) => (
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

// --- ThinkingSpinner Component ---
const InlinedSpinner = () => {
  const [frame, setFrame] = useState(0);
  const spinner = spinners.dots;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((previousFrame) => {
        const isLastFrame = previousFrame === spinner.frames.length - 1;
        return isLastFrame ? 0 : previousFrame + 1;
      });
    }, spinner.interval);

    return () => {
      clearInterval(timer);
    };
  }, [spinner]);

  return <Text>{spinner.frames[frame]}</Text>;
};

const ThinkingSpinner = () => (
  <Box>
    <Text color="yellow">
      <InlinedSpinner /> Thinking...
    </Text>
  </Box>
);

// --- Main App Component ---
const App = () => {
  const [activeMode, setActiveMode] = useState<"plan" | "build">("plan");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "thinking" | "ready" | "executing"
  >("idle");
  const [autoRun, setAutoRun] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [cwd, setCwd] = useState(process.cwd());
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "[Cogito] Awaiting your thoughts...",
  ]);
  const [focusedStep, setFocusedStep] = useState(0);

  useEffect(() => {
    if (autoRun && status === "ready" && activeMode === "build") {
      const nextStepIndex = roadmap.findIndex(
        (step) => step.status === "pending"
      );
      if (nextStepIndex !== -1) {
        setFocusedStep(nextStepIndex);
        executeStep(roadmap[nextStepIndex].id);
      }
    }
  }, [autoRun, status, activeMode, roadmap]);

  useInput((input, key) => {
    if (activeMode === "build") {
      if (key.upArrow) {
        setFocusedStep(Math.max(0, focusedStep - 1));
      }
      if (key.downArrow) {
        setFocusedStep(Math.min(roadmap.length - 1, focusedStep + 1));
      }
      if (key.return) {
        const step = roadmap[focusedStep];
        if (step && (step.status === "pending" || step.status === "failed")) {
          executeStep(step.id);
        }
      }
    }
  });

  useInput((input) => {
    if (input === "p") setActiveMode("plan");
    if (input === "b" && roadmap.length > 0) setActiveMode("build");
    if (input === "a") setAutoRun((v) => !v);
    if (input === "q") process.exit();
  });

  const handlePlanSubmit = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    setStatus("thinking");
    setTerminalLines((p) => [
      ...p,
      `[Cogito] Received your thought: "${trimmedInput}"`,
    ]);

    setTimeout(() => {
      const projectName =
        trimmedInput
          .split(" ")
          .pop()
          ?.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || "new-project";

      const mockRoadmap: RoadmapStep[] = [
        {
          id: 1,
          title: "Create project directory",
          cmd: `mkdir ${projectName}-project`,
          desc: "A home for your new idea.",
          status: "pending",
        },
        {
          id: 2,
          title: "Navigate into directory",
          cmd: `cd ${projectName}-project`,
          desc: "Setting the context for our work.",
          status: "pending",
        },
        {
          id: 3,
          title: "Initialize Git repository",
          cmd: "git init",
          desc: "Setting up version control.",
          status: "pending",
        },
        {
          id: 4,
          title: "Check Node Environment",
          cmd: "node -v",
          desc: "Verifying the runtime.",
          status: "pending",
        },
      ];
      setRoadmap(mockRoadmap);
      setStatus("ready");
      setTerminalLines((p) => [
        ...p,
        '[Cogito] Roadmap drafted. Press "b" to switch to Build mode.',
      ]);
    }, 1000);
  };

  const updateStepStatus = (id: number, newStatus: RoadmapStep["status"]) => {
    setRoadmap((prev) => {
      const newRoadmap = [...prev];
      const stepIndex = newRoadmap.findIndex((s) => s.id === id);
      if (stepIndex !== -1) {
        newRoadmap[stepIndex] = { ...newRoadmap[stepIndex], status: newStatus };
      }
      return newRoadmap;
    });
  };

  const executeStep = (id: number) => {
    const step = roadmap.find((s) => s.id === id);
    if (!step) return;

    setStatus("executing");
    updateStepStatus(id, "executing");

    if (step.cmd.startsWith("cd ")) {
      const newDir = step.cmd.substring(3).trim();
      const newCwd = path.resolve(cwd, newDir);

      if (fs.existsSync(newCwd) && fs.statSync(newCwd).isDirectory()) {
        setCwd(newCwd);
        setTerminalLines((p) => [
          ...p,
          `[Success] Changed directory to ${newCwd}`,
        ]);
        updateStepStatus(id, "completed");
      } else {
        setTerminalLines((p) => [
          ...p,
          `[Error] cd: no such file or directory: ${newDir}`,
        ]);
        updateStepStatus(id, "failed");
        setAutoRun(false);
      }
      setStatus("ready");
      return;
    }

    exec(step.cmd, { cwd }, (err, stdout, stderr) => {
      if (err) {
        setTerminalLines((p) => [...p, `[Error] ${stderr}`]);
        updateStepStatus(id, "failed");
        setAutoRun(false);
      } else {
        setTerminalLines((p) => [...p, `[Success] ${stdout.trim()}`]);
        updateStepStatus(id, "completed");
      }
      setStatus("ready");
    });
  };

  return (
    <Box
      flexDirection="column"
      width="100%"
      borderStyle="single"
      borderColor="magenta"
    >
      <Header activeMode={activeMode} autoRun={autoRun} />
      <Box flexGrow={1}>
        {status === "thinking" && <ThinkingSpinner />}
        {activeMode === "plan" && status !== "thinking" && (
          <PlanView
            input={input}
            setInput={setInput}
            onSubmit={handlePlanSubmit}
          />
        )}
        {activeMode === "build" && (
          <BuildView roadmap={roadmap} focusedStep={focusedStep} />
        )}
      </Box>
      <TerminalOutput lines={terminalLines} />
      <Text color="gray">Press 'q' to quit.</Text>
    </Box>
  );
};

export default App;
