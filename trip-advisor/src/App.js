import React from "react";
// import PropTypes from "prop-types";
import LocationIndex from "./location";
import LocationDetail from "./locationDetail";
import ScheduleIndex from "./schedule";
import MemberIndex from "./member";
import styles from "./scss/App.module.scss";
import icon from "./image/icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeAsia,
  faMapMarkedAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className={styles.app}>
          <nav>
            <div className={styles.flexWrap}>
              <a className={styles.icon}>
                <img src={icon} alt="icon" />
                <div>Travel Advisor</div>
              </a>

              <ul>
                <li>
                  <FontAwesomeIcon icon={faGlobeAsia} />
                  <Link to="/">挑選地點</Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                  <Link to="/schedule">規劃行程</Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faUserCircle} />
                  <Link to="/member">會員</Link>
                </li>
              </ul>
            </div>
          </nav>

          <Switch>
            <Route exact path="/" component={LocationIndex} />
            <Route
              exact
              path="/locationDetail/:tags"
              component={LocationDetail}
            />
            <Route path="/schedule" component={ScheduleIndex} />
            <Route path="/member" component={MemberIndex} />
          </Switch>
        </div>
      </Router>
    );
  }
}

// App.propTypes = {
//   history: PropTypes.object.isRequired
// };

export default App;
