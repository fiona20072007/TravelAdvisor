import React from "react";
import LocationIndex from "./location";
import LocationDetail from "./locationDetail";
import ScheduleIndex from "./schedule";
import styles from "./scss/App.module.scss";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//Link
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className={styles.app}>
          <Switch>
            <Route exact path="/" component={LocationIndex} />
            <Route
              exact
              path="/locationDetail/:tags"
              component={LocationDetail}
            />
            <Route exact path="/schedule" component={ScheduleIndex} />
          </Switch>
        </div>
      </Router>
    );
  }
}

{
  /* <nav>
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/locationDetail">景點</Link>
    </li>
    <li>
      <Link to="/users">Users</Link>
    </li>
  </ul>
</nav>; */
}

export default App;
