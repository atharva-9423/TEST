import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ProgressListResponse, type UpdateProgressInput } from "@shared/routes";

// GET /api/progress
export function useProgress() {
  return useQuery({
    queryKey: [api.progress.list.path],
    queryFn: async () => {
      const res = await fetch(api.progress.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch progress");
      return api.progress.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/progress
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProgressInput) => {
      const validated = api.progress.update.input.parse(data);
      const res = await fetch(api.progress.update.path, {
        method: api.progress.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.progress.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to update progress');
      }
      return api.progress.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.progress.list.path] });
    },
  });
}
