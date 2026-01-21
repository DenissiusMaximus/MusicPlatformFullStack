import {
  selectIsAuthenticated,
} from "../store/slices/auth";
import {  useAppSelector } from "./redux";

const useAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);


  return {
    isAuthenticated
  };
};

export default useAuth;
