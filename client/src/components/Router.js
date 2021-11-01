import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom"
import Navbar from "./Shared/Navbar"
import Login from "./Login/Login.js"
import Register from "./Register/Register"
import Forget from "./Forget/Forget"
import Home from "./Home/Home"
import Movie from "./Movie/Movie"
import Profile from "./Profile/Profile"
import isAuth from "../service/decodeToken"
import Store from "../context/store"
import Profiles from '../components/Profiles/Profiles'

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) => (isAuth() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        ))}
      />
    );
  }

function App() {
    return (
        <Router>
            <Store>
                <Navbar />
                <Switch>
                    <Route exact path="/login"> 
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/reset-password">
                        <Forget />
                    </Route>
                    <PrivateRoute exact path="/">
                        <Home />
                    </PrivateRoute>
                    <PrivateRoute path="/home">
                        <Home />
                    </PrivateRoute>
                    <PrivateRoute path="/profile/:id">
                        <Profile />
                    </PrivateRoute>
                    <PrivateRoute path="/movie/:id">
                        <Movie />
                    </PrivateRoute>
                    <PrivateRoute path="/profiles">
                      <Profiles/>
                    </PrivateRoute>
                </Switch>
            </Store>
        </Router>
    )
}

export default App