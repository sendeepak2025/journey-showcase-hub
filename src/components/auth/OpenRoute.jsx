
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return children;
  }

  return  <Navigate to="/" />
 
}

export default OpenRoute;
