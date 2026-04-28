import React, { useState } from 'react'
import { Input, Button, InputGroup, Alert, Table } from 'reactstrap'
import axios from 'axios'

interface MovedGame {
    gameId: number
    gameDate: string
    points: number
    rebounds: number
    assists: number
}

interface TransferResult {
    message: string
    playerName: string
    fromTeam: string
    toTeam: string
    movedGames: MovedGame[]
}

export const TransferPlayer = (): React.JSX.Element => {
    const [playerName, setPlayerName] = useState<string>('')
    const [teamName, setTeamName] = useState<string>('')
    const [result, setResult] = useState<TransferResult | null>(null)
    const [error, setError] = useState<string>('')

    const handleTransfer = async (): Promise<void> => {
        setResult(null)
        setError('')
        try {
            const response = await axios.post('/players/transfer', {
                playerName: playerName,
                newTeamName: teamName
            })
            setResult(response.data)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Transfer failed')
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <h1>Transfer Player</h1>
            <p className="text-muted mb-3">
                Move a player's 5 most recent games to a new team.
            </p>

            <InputGroup className="mb-2">
                <Input
                    type="text"
                    placeholder="Player name (e.g. LeBron)"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <Input
                    type="text"
                    placeholder="New team name (e.g. Lakers)"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
            </InputGroup>

            <Button color="primary" onClick={handleTransfer}>
                Transfer
            </Button>

            {error && <Alert color="danger" className="mt-3">{error}</Alert>}

            {result && (
                <div className="mt-4">
                    <Alert color="success">
                        <strong>{result.playerName}</strong> transferred
                        from <strong>{result.fromTeam}</strong> to <strong>{result.toTeam}</strong>
                    </Alert>

                    <h4 className="mt-3 mb-2">Games Moved ({result.movedGames.length})</h4>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Game ID</th>
                                <th>Date</th>
                                <th>Points</th>
                                <th>Rebounds</th>
                                <th>Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.movedGames.map((game) => (
                                <tr key={game.gameId}>
                                    <td>{game.gameId}</td>
                                    <td>{game.gameDate}</td>
                                    <td>{game.points}</td>
                                    <td>{game.rebounds}</td>
                                    <td>{game.assists}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default TransferPlayer