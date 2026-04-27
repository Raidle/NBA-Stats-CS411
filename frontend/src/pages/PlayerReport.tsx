import React, { useState } from 'react'
import {
    Input,
    Button,
    InputGroup,
    Table,
    Alert
} from 'reactstrap'
import Loading from '../components/Loading'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface CareerStat {
    firstName: string
    lastName: string
    teamName: string
    gamesPlayed: number
    avgPoints: number
    avgRebounds: number
    avgAssists: number
    careerMaxPointsPerGame: number
}

interface TeamComparison {
    teamName: string
    teamAvgPoints: number
    playerAvgPoints: number
}

interface ReportResponse {
    careerStats: CareerStat[]
    teamComparison: TeamComparison[]
}

export const PlayerReport = (): React.JSX.Element => {
    const [nameInput, setNameInput] = useState<string>('')
    const [searchName, setSearchName] = useState<string>('')

    const { isPending: loading, data, error } = useQuery<ReportResponse>({
        queryKey: ['playerReport', searchName],
        queryFn: async () => {
            const response = await axios.get(`/players/report?name=${encodeURIComponent(searchName)}`)
            return response.data
        },
        enabled: searchName !== '',
    })

    const handleSearch = (): void => {
        if (nameInput.trim()) {
            setSearchName(nameInput.trim())
        }
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h1>Player Performance Report</h1>
            <p className="text-muted mb-3">
                Enter a player name to view their career stats and team comparison.
            </p>

            <InputGroup className="mb-4">
                <Input
                    type="text"
                    placeholder="Enter player name (e.g. LeBron)..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch()
                    }}
                />
                <Button color="primary" onClick={handleSearch}>
                    Get Report
                </Button>
            </InputGroup>

            {error && (
                <Alert color="danger">
                    Player not found. Please check the ID and try again.
                </Alert>
            )}

            {loading && <Loading />}

            {data && data.careerStats.length > 0 && (
                <>
                    <h3 className="mt-4 mb-3">Career Stats</h3>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Team</th>
                                <th>Games</th>
                                <th>PPG</th>
                                <th>RPG</th>
                                <th>APG</th>
                                <th>Career High</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.careerStats.map((stat, index) => (
                                <tr key={index}>
                                    <td>{stat.firstName} {stat.lastName}</td>
                                    <td>{stat.teamName}</td>
                                    <td>{stat.gamesPlayed}</td>
                                    <td>{stat.avgPoints}</td>
                                    <td>{stat.avgRebounds}</td>
                                    <td>{stat.avgAssists}</td>
                                    <td>{stat.careerMaxPointsPerGame}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h3 className="mt-4 mb-3">Player vs Team Average</h3>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Team Avg PPG</th>
                                <th>Player Avg PPG</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.teamComparison.map((comp, index) => (
                                <tr key={index}>
                                    <td>{comp.teamName}</td>
                                    <td>{comp.teamAvgPoints}</td>
                                    <td>{comp.playerAvgPoints}</td>
                                    <td style={{
                                        color: comp.playerAvgPoints - comp.teamAvgPoints > 0
                                            ? 'green' : 'red'
                                    }}>
                                        {(comp.playerAvgPoints - comp.teamAvgPoints) > 0 ? '+' : ''}
                                        {(comp.playerAvgPoints - comp.teamAvgPoints).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    )
}

export default PlayerReport