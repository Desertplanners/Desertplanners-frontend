import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RemoveTrailingSlash() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.endsWith("/") && location.pathname !== "/") {
      const newPath = location.pathname.replace(/\/+$/, "");
      navigate(newPath + location.search, { replace: true });
    }
  }, [location]);

  return null;
}
