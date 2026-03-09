import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function AppLogo() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogoClick() {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <button className="logo" onClick={handleLogoClick}>
      <img src="/logo.svg" alt="logo" width="28" height="28" />
      <span className="logo-text">a-poc</span>
    </button>
  );
}
