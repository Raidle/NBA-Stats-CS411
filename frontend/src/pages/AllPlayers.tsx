import React, {useEffect, useMemo, useState} from 'react'
import {
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
    if (width < 576) {
        return 4;
    }

    if (width < 992) {
        return 6;
    }

    return 10;
};

export const AllPlayers = (): React.JSX.Element => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [visiblePageCount, setVisiblePageCount] = useState<number>(10);

    const { isPending: loading, data: playerStats = [], error } = useQuery<PlayerDTO[]>({
        queryKey: ['allPlayers'],
        queryFn: async () => {
            const response = await axios.get('/players');
            return response.data;
        },
    });

    useEffect(() => {
        const updateVisiblePageCount = (): void => {
            setVisiblePageCount(getVisiblePageCount(window.innerWidth));
        };

        updateVisiblePageCount();
        window.addEventListener('resize', updateVisiblePageCount);

        return () => {
            window.removeEventListener('resize', updateVisiblePageCount);
        };
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
        return <div>Unable to load players.</div>
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>NBA Players</h1>
            <Table bordered hover responsive>
                {
                    loading ? (
                        <>
                            {/** Render loading state with black lined border*/}
                            <tbody>
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            </tbody>
                        </>
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
                    )
                }
            </Table>
            <div className="d-flex justify-content-center">
                <Pagination aria-label="Player stats pagination">
                    <PaginationItem disabled={activePage === 1}>
                        <PaginationLink first href="#" onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(1);
                        }} />
                    </PaginationItem>
                    <PaginationItem disabled={activePage === 1}>
                        <PaginationLink previous href="#" onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage((page) => Math.max(page - 1, 1));
                        }} />
                    </PaginationItem>
                    {visiblePages.map((pageNumber) => (
                        <PaginationItem key={pageNumber} active={pageNumber === activePage}>
                            <PaginationLink
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setCurrentPage(pageNumber);
                                }}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem disabled={activePage === totalPages || totalPages === 0}>
                        <PaginationLink next href="#" onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage((page) => Math.min(page + 1, totalPages));
                        }} />
                    </PaginationItem>
                    <PaginationItem disabled={activePage === totalPages || totalPages === 0}>
                        <PaginationLink last href="#" onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(totalPages);
                        }} />
                    </PaginationItem>
                </Pagination>
            </div>
        </div>
    );
}

export default AllPlayers;