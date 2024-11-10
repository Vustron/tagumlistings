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
import { Button } from "@/components/ui/button"

// hooks
import { useGetProperty } from "@/lib/hooks/property/get"

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full p-4 overflow-auto">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Failed to load property details.</p>
          ) : data ? (
            <div>
              <p>Location: {data.location}</p>
              <p>Price: {data.price}</p>
              <p>Bedrooms: {data.no_of_bedrooms}</p>
              <p>Bathrooms: {data.no_of_bathrooms}</p>
              <p>Area: {data.square_meter} m²</p>
              <p>Status: {data.status}</p>
              <p>Listed on: {data.created_at}</p>
              <p>Last updated: {data.updated_at}</p>
              {data.propertyPics && data.propertyPics.length > 0 && (
                <ImageCarousel images={data.propertyPics} />
              )}
            </div>
          ) : (
            <p>No property details available.</p>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
