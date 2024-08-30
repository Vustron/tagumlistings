"use client"

// components
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <Button
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {pageNumbers.map((page) => (
        <Button
          key={page}
          className={`px-4 py-2 rounded-md ${
            page === currentPage
              ? "bg-green-600 text-white dark:bg-green-700"
              : "bg-green-400 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-600"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
