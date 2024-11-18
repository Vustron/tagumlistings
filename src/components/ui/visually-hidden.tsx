import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

const VisuallyHiddenComponent = ({
  children,
}: { children: React.ReactNode }) => {
  return <VisuallyHidden.Root>{children}</VisuallyHidden.Root>
}

export default VisuallyHiddenComponent
