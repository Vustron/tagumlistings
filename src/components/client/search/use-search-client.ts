"use client"

import { useGetProperties } from "@/lib/hooks/property/get-all"
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next-nprogress-bar"

import type { Filter, Property } from "@/lib/types"

export const useSearchClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 9
  const query = searchParams.get("query") || ""
  const [showReservedProperties, setShowReservedProperties] = useState(false)

  const initialFilters: Partial<Filter> = {
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    status: searchParams.get("status") || "",
  }

  const [filters, setFilters] = useState<Partial<Filter>>(initialFilters)

  const shouldPaginate =
    query || Object.values(filters).some((value) => value !== "")

  const { data, isLoading } = shouldPaginate
    ? useGetProperties({
        page: currentPage,
        limit: itemsPerPage,
        query,
      })
    : useGetProperties()

  const filteredProperties = useMemo(() => {
    if (!data?.properties) return []

    return data.properties.filter((property: Property) => {
      if (!property) return false

      if (
        !showReservedProperties &&
        property.status?.toLowerCase() === "reserved"
      ) {
        return false
      }

      const matchesCategory = filters.category
        ? property.category === filters.category
        : true
      const matchesLocation = filters.location
        ? (property.location ?? "")
            .toLowerCase()
            .includes(filters.location.toLowerCase())
        : true
      const matchesStatus = filters.status
        ? property.status === filters.status
        : true

      return matchesCategory && matchesLocation && matchesStatus
    })
  }, [data?.properties, filters, showReservedProperties])

  const totalCount = filteredProperties.length
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const displayProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return shouldPaginate
      ? filteredProperties
      : filteredProperties.slice(startIndex, endIndex)
  }, [currentPage, filteredProperties, shouldPaginate])

  useEffect(() => {
    const params = new URLSearchParams()

    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    }

    if (query) {
      params.set("query", query)
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.set(key, value)
      }
    }

    const queryString = params.toString()
    router.push(queryString ? `/search?${queryString}` : "/search", {
      scroll: false,
    })
  }, [filters, currentPage, query, router])

  const handleFilterChange = (filterType: keyof Filter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      status: "",
    })
    router.push("/search")
  }

  const categories = useMemo(() => {
    if (!data?.properties) return []
    const uniqueCategories = new Set(
      data.properties
        .map((property: Property) => property.category)
        .filter(Boolean),
    )
    return Array.from(uniqueCategories)
  }, [data?.properties])

  return {
    query,
    filters,
    setFilters,
    handleFilterChange,
    clearFilters,
    showReservedProperties,
    setShowReservedProperties,
    isLoading,
    displayProperties,
    totalCount,
    totalPages,
    currentPage,
    categories,
  }
}
