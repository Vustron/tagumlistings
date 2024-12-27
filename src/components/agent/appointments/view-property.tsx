"use client"

// components
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import ImageCarousel from "@/components/client/property-id/image-carousel"
import { Home, Bath, Bed, Square, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

// hooks
import { useGetProperty } from "@/lib/hooks/property/get"

// utils
import { formatDate, formatPriceToPHP } from "@/lib/utils"

interface PropertyViewDialogProps {
  propertyId: string
  isOpen: boolean
  onClose: () => void
}

export const ViewPropertyDialog = ({
  propertyId,
  isOpen,
  onClose,
}: PropertyViewDialogProps) => {
  const { data, isLoading, error } = useGetProperty(propertyId)

  const isValidDate = (date: any) => {
    return date instanceof Date && !Number.isNaN(date.getTime())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-6 overflow-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-semibold">
            Property Details
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="py-6">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              Failed to load property details.
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Images Section */}
              {data.propertyPics && data.propertyPics.length > 0 && (
                <div className="mb-6">
                  <ImageCarousel images={data.propertyPics} />
                </div>
              )}

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Location & Price */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Location:</span>
                      <span>{data.location}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPriceToPHP(data.price?.toLocaleString()!)}
                    </div>
                  </div>

                  {/* Property Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-gray-600" />
                      <span>{data.no_of_bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-gray-600" />
                      <span>{data.no_of_bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-gray-600" />
                      <span>{data.square_meter} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="px-2 py-1 rounded-full text-sm 
                        ${data.status === 'available' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'}"
                      >
                        {data.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates & Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Listed on:</span>
                    <span>
                      {data.created_at && isValidDate(new Date(data.created_at))
                        ? formatDate(new Date(data.created_at))
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Last updated:</span>
                    <span>
                      {data.updated_at && isValidDate(new Date(data.updated_at))
                        ? formatDate(new Date(data.updated_at))
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No property details available.
            </div>
          )}
        </DialogDescription>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg
              transition-colors duration-200"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
