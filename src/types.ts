export type RoadmapStep = {
  id: number;
  title: string;
  cmd: string;
  desc: string;
  status: "pending" | "executing" | "completed" | "failed";
};
