import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import HomePage from "./components/HomePage";
import DisplayGroups from "./components/Groups/DisplayGroups";
import GroupAndEventDisplay from "./components/GroupAndEventDisplay";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route path="/groups">
            <GroupAndEventDisplay type="groups"/>
          </Route>
          <Route path="/events">
            <GroupAndEventDisplay type="events" />
          </Route>
          <Route exact path='/'>
            <HomePage />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
