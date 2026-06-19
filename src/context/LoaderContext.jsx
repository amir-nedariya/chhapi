import { createContext, useContext, useState } from "react";
import FullScreenLoader from "../components/common/FullScreenLoader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {loading && <FullScreenLoader />}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
