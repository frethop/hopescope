import {
  AboutApp,
  AdminDashboard,
  AlumniStoriesList,
  AlumStoryDetails,
  FrogPage,
  MapView,
  MoveNavButton,
  Navigation,
} from "components";
import { HandshakeCareersContext, PeopleGroveAlumniContext } from "contexts";
import React, { useContext } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
// import { isLoggedInToPG, loginToPG, logoutOfPG } from "services";
import { URLPaths } from "utilities";

export function App(): JSX.Element {
  const { items: handshakeCareers, isLoading: isHandshakeCareersLoading } = useContext(
    HandshakeCareersContext,
  );
  const { items: peopleGroveAlumni, isLoading: isPeopleGroveAlumniLoading } = useContext(
    PeopleGroveAlumniContext,
  );

  return (
    <div>
      <Router>
        <Navigation />
        <MoveNavButton />
        <AboutApp />
        <Switch>
          <Route exact path={URLPaths.alumStories}>
            <MapView background />
            <AlumniStoriesList />
          </Route>
          <Route exact path={URLPaths.admin}>
            <MapView background />
            <AdminDashboard />
          </Route>
          <Route exact path={`${URLPaths.alumStories}/:id`}>
            <AlumStoryDetails />
          </Route>
          <Route exact path={URLPaths.careerFinder}>
            <MapView data={handshakeCareers} isLoading={isHandshakeCareersLoading} />
          </Route>
          <Route exact path={URLPaths.alumFinder}>
            <>
              <MapView data={peopleGroveAlumni} isLoading={isPeopleGroveAlumniLoading} />
            </>
          </Route>
          <Route exact path={URLPaths.frog}>
            <FrogPage />
          </Route>
          <Route>
            <Redirect to={URLPaths.alumFinder} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
