import { Provider } from "react-wrap-balancer"

const WrapBalancer = ({ children }: React.PropsWithChildren) => {
  return <Provider>{children}</Provider>
}

export default WrapBalancer
