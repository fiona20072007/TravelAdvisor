import React from "react";
// import PropTypes from "prop-types";
import LocationIndex from "./location";
import LocationDetail from "./locationDetail";
import ScheduleIndex from "./schedule";
import MemberIndex from "./member";
import Profile from "./member/profile";
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
  constructor(props) {
    super(props);
    this.lastScrollTop = 0;
    this.state = {
      hidden: false,
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop > this.lastScrollTop) {
      this.lastScrollTop = currentScrollTop;
      this.setState({ hidden: true });
    } else {
      this.lastScrollTop = currentScrollTop;
      this.setState({ hidden: false });
    }
  };
  handleShowEditNav = () => {
    if (window.location.pathname.substring(0, 9) === "/schedule") {
      window.location.replace("/schedule");
    } else {
      return;
    }
  };
  render() {
    return (
      <Router>
        <div className={styles.loading} id="loading">
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <div className={styles.app}>
          <nav className={this.state.hidden ? styles.hide : styles.active}>
            <div className={styles.flexWrap}>
              <a className={styles.icon}>
                <img src={icon} alt="icon" />
                <div id="MainTitle">Travel Advisor</div>
              </a>
              <nav className={styles.menu}>
                <input
                  type="checkbox"
                  href="#"
                  className={styles["menu-open"]}
                  name="menu-open"
                  id="menu-open"
                />
                <label
                  className={styles["menu-open-button"]}
                  htmlFor="menu-open"
                >
                  <span
                    className={`${styles.hamburger} ${styles["hamburger-1"]}`}
                  ></span>
                  <span
                    className={`${styles.hamburger} ${styles["hamburger-2"]}`}
                  ></span>
                  <span
                    className={`${styles.hamburger} ${styles["hamburger-3"]}`}
                  ></span>
                </label>

                <Link
                  to="/member"
                  className={styles["menu-item"]}
                  data-title="會員"
                >
                  <FontAwesomeIcon icon={faUserCircle} />
                  {/* 會員 */}
                </Link>

                <Link
                  to="/schedule"
                  onClick={this.handleShowEditNav}
                  className={styles["menu-item"]}
                  data-title="行程"
                >
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                  {/* 規劃行程 */}
                </Link>

                <Link to="/" className={styles["menu-item"]} data-title="搜尋">
                  <FontAwesomeIcon icon={faGlobeAsia} />
                  {/* 挑選地點 */}
                </Link>
              </nav>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                  <filter id="shadowed-goo">
                    <feGaussianBlur
                      in="SourceGraphic"
                      result="blur"
                      stdDeviation="10"
                    />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                      result="goo"
                    />
                    <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
                    <feColorMatrix
                      in="shadow"
                      mode="matrix"
                      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
                      result="shadow"
                    />
                    <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                    <feComposite in2="shadow" in="goo" result="goo" />
                    <feComposite in2="goo" in="SourceGraphic" result="mix" />
                  </filter>
                  <filter id="goo">
                    <feGaussianBlur
                      in="SourceGraphic"
                      result="blur"
                      stdDeviation="10"
                    />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                      result="goo"
                    />
                    <feComposite in2="goo" in="SourceGraphic" result="mix" />
                  </filter>
                </defs>
              </svg>

              {/* <ul>
                <li>
                  <FontAwesomeIcon icon={faGlobeAsia} />
                  <Link to="/">挑選地點</Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                  <Link to="/schedule" onClick={this.handleShowEditNav}>
                    規劃行程
                  </Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faUserCircle} />
                  <Link to="/member">會員</Link>
                </li>
              </ul> */}
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
            <Route path="/profile" component={Profile} />
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
