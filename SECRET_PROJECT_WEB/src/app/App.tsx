import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const App = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.autorization.isLoggedIn
  );

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <MainPage />;
};

export default App;
