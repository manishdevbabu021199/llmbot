import apiClient from "@/components/utility/api/apiClient";
import { APIConstants } from "../api.constants";

export class DashboardService {
  async funGetTasks() {
    try {
      const tasks = await apiClient.get(APIConstants.GET_USER_TASK);
      return tasks;
    } catch {
      return null;
    }
  }
  async funGetEscalations() {
    try {
      const escalations = await apiClient.get(APIConstants.GET_ESCALTIONS);
      return escalations;
    } catch {
      return null;
    }
  }
  async funGetGroups() {
    try {
      const groups = await apiClient.get(APIConstants.GET_GROUPS);
      return groups;
    } catch {
      return null;
    }
  }
}
