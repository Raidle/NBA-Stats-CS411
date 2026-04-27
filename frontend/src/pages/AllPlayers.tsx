import React, { useEffect, useMemo, useState } from 'react'
import {
    Input,
    Button,
    InputGroup,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table
} from 'reactstrap'
import Loading from '../components/Loading'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type PlayerDTO from '../models/DTO/PlayerDTO'

const getVisiblePageCount = (width: number): number => {
    if (width < 576) return 4;
    if (width < 992) return 6;
    return 10;
};

export const AllPlayers = (): React.JSX.Element => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [visiblePageCount, setVisiblePageCount] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch all players when no search, or search results when searching
    const { isPending: loading, data: playerStats = [], error } = useQuery<PlayerDTO[]>({
        queryKey: ['players', searchQuery],
        queryFn: async () => {
            const url = searchQuery
                ? `/players/search?name=${encodeURIComponent(searchQuery)}`
                : '/players';
            const response = await axios.get(url);
            return response.data;
        },
    });

    const handleSearch = (): void => {
        setSearchQuery(searchTerm);
        setCurrentPage(1);
    };

    const handleClear = (): void => {
        setSearchTerm('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    useEffect(() => {
        const updateVisiblePageCount = (): void => {
            setVisiblePageCount(getVisiblePageCount(window.innerWidth));
        };
        updateVisiblePageCount();
        window.addEventListener('resize', updateVisiblePageCount);
        return () => window.removeEventListener('resize', updateVisiblePageCount);
    }, []);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(playerStats.length / pageSize));
    const activePage = Math.min(currentPage, totalPages);

    const paginatedPlayerStats = useMemo(() => {
        const startIndex = (activePage - 1) * pageSize;
        return playerStats.slice(startIndex, startIndex + pageSize);
    }, [activePage, playerStats]);

    const firstVisiblePage = Math.max(
        1,
        Math.min(
            activePage - Math.floor(visiblePageCount / 2),
            Math.max(totalPages - visiblePageCount + 1, 1),
        ),
    );
    const lastVisiblePage = Math.min(totalPages, firstVisiblePage + visiblePageCount - 1);
    const visiblePages = Array.from(
        { length: Math.max(lastVisiblePage - firstVisiblePage + 1, 0) },
        (_, index) => firstVisiblePage + index,
    );

    if (error) {
        return <div>Unable to load players.</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>NBA Players</h1>

            {/* Search Bar */}
            <InputGroup className="mb-3">
                <Input
                    type="text"
                    placeholder="Search by player name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />
                <Button color="primary" onClick={handleSearch}>
                    Search
                </Button>
                {searchQuery && (
                    <Button color="secondary" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </InputGroup>

            {searchQuery && (
                <p className="text-muted mb-3">
                    Showing results for "{searchQuery}" ({playerStats.length} found)
                </p>
            )}

            <Table bordered hover responsive>
                {loading ? (
                    <tbody>
                        <tr>
                            <td colSpan={4} className="text-center">
                                <Loading />
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Height (inches)</th>
                                <th>Body Weight (lbs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPlayerStats.map((player) => (
                                <tr key={player.id}>
                                    <td>{player.firstName}</td>
                                    <td>{player.lastName}</td>
                                    <td>{player.heightInches == 0 ? 'N/A' : player.heightInches}</td>
                                    <td>{player.bodyWeightLbs == 0 ? 'N/A' : player.bodyWeightLbs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}
            </Table>

            {/* Pagination stays the same */}
            <div className="d-flex justify-content-center">
                <Pagination aria-label="Player stats pagination">
                    <PaginationItem disabled={activePage === 1}>
                        <PaginationLink first href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1); }} />
                    </PaginationItem>
                    <PaginationItem disabled={activePage === 1}>
                        <PaginationLink previous href="#" onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(p - 1, 1)); }} />
                    </PaginationItem>
                    {visiblePages.map((pageNumber) => (
                        <PaginationItem key={pageNumber} active={pageNumber === activePage}>
                            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(pageNumber); }}>
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem disabled={activePage === totalPages || totalPages === 0}>
                        <PaginationLink next href="#" onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(p + 1, totalPages)); }} />
                    </PaginationItem>
                    <PaginationItem disabled={activePage === totalPages || totalPages === 0}>
                        <PaginationLink last href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }} />
                    </PaginationItem>
                </Pagination>
            </div>
        </div>
    );
};

export default AllPlayers;