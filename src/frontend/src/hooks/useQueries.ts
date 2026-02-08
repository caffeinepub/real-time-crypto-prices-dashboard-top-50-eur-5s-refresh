import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useBackendHealth() {
    const { actor, isFetching } = useActor();

    return useQuery<string>({
        queryKey: ['backend-health'],
        queryFn: async () => {
            if (!actor) {
                throw new Error('Actor not initialized');
            }
            return actor.healthCheck();
        },
        enabled: !!actor && !isFetching,
        staleTime: 30000, // 30 seconds
        retry: 3
    });
}

export function useBackendVersion() {
    const { actor, isFetching } = useActor();

    return useQuery<string>({
        queryKey: ['backend-version'],
        queryFn: async () => {
            if (!actor) {
                throw new Error('Actor not initialized');
            }
            return actor.version();
        },
        enabled: !!actor && !isFetching,
        staleTime: Infinity
    });
}
