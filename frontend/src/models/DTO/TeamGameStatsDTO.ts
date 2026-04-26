export default interface TeamGameStatsDTO {
    teamId: number;
    teamName: string;
    city: string;
    avgHomeScore: number;
    avgAwayScore: number;
    homeAwayDiff: number;
}