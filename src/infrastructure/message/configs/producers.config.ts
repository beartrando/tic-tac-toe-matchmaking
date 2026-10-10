export const messageProducersConfig: Record<string, string> = {
    matchmakingMatched: process.env.MESSAGE_PRODUCER_TOPIC_MATCHMAKING_MATCHED ?? 'matchmaking.matched',
};
export default messageProducersConfig;
