import { useDemo } from "../../context/DemoContext";
import type { ApplicationStatus } from "../../data/types";

export const useAdminData = useDemo;

export const applicationTone = (status: ApplicationStatus): "warning" | "success" | "danger" =>
  status === "Pending" ? "warning" : status === "Approved" ? "success" : "danger";
