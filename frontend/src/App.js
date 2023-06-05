import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import HomePage from "./components/HomePage";
import GroupAndEventDisplay from "./components/GroupAndEventDisplay";
import GroupPage from "./components/Groups/GroupPage";
import CreateGroup from "./components/Groups/CreateGroup";

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
          <Route exact path="/groups">
            <GroupAndEventDisplay type="groups"/>
          </Route>
          <Route exact path="/groups/new">
            <CreateGroup />
          </Route>
          <Route path="/groups/:groupId">
            <GroupPage />
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
