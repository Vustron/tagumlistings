"use client"

// components
import PropertyCard from "@/app/(client)/_components/property-card"

// hooks
import { useSearchParams } from "next/navigation"

// utils
import { properties } from "@/app/(client)/constants"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"

export default function Properties() {
  const searchParams = useSearchParams()

  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const itemsPerPage = 8

  const indexOfLastProperty = currentPage * itemsPerPage
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  )

  return (
    <div className="font-sans min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
      <main className="mx-auto pt-8 pb-16 max-w-7xl px-4 relative z-10">
        <h2 className="text-3xl font-bold mb-6">Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
        <div className="mt-5">
          <PaginationWithLinks
            totalCount={properties.length}
            pageSize={itemsPerPage}
            page={currentPage}
          />
        </div>
      </main>
    </div>
  )
}
