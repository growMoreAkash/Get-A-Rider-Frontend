import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useGetAllDrivers from '../../hooks/useGetAllDrivers';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ onPageChange }) => {
    const [index, setIndex] = useState(0);
    const totalPages = 10;
    const currentPage = 0;
    const [page, setPage] = useState(0);
    const { drivers,getAllDrivers } = useGetAllDrivers(page);

    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage((prevPage: number) => prevPage + 1); // ✅ Updates page
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            setPage((prevPage: number) => prevPage - 1); // ✅ Updates page
        }
    };
    return (
        <div className="flex justify-center items-center mt-4 gap-2">
            <button
                onClick={() => {
                    setIndex((prevIndex) => prevIndex - 1);
                    setPage((prevPage: any) => {
                        const newPage = prevPage - 1;
                        getAllDrivers(newPage); // Call API with the updated page
                        return newPage;
                    });
                }}
                disabled={index === 0}
                className="px-4 py-2 border rounded-md bg-white text-teal-500 hover:bg-teal-100 disabled:opacity-50"
            >
                Prev
            </button>
            <button className={`px-4 py-2 border rounded-md ${currentPage === index ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 hover:bg-teal-100'}`}>{index}</button>
            <button
                onClick={() => {
                    setIndex((prevIndex) => prevIndex + 1);
                    setPage((prevPage: any) => {
                        const newPage = prevPage + 1;
                        getAllDrivers(newPage); // Call API with the updated page
                        return newPage;
                    });
                }}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border rounded-md bg-white text-teal-500 hover:bg-teal-100 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
