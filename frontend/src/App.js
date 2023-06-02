import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";

export default function App() {
  return (
    <Switch>
      <Route path="/login">
        <LoginFormPage />
      </Route>
    </Switch>
  );
}
