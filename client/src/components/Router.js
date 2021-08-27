import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Navbar from "./Shared/Navbar"
import Login from "./Login/Login.js"
import Register from "./Register/Register"
import Forget from "./Forget/Forget"
import Home from "./Home/Home"
import Movie from "./Movie/Movie"
import Profile from "./Profile/Profile"

function App() {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/"> 
                    <Login />
                </Route>
                <Route path="/home">
                    <Home />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/reset-password">
                    <Forget />
                </Route>
                <Route path="/profile/:username">
                    <Profile />
                </Route>
                <Route path="/movie/:id">
                    <Movie />
                </Route>
            </Switch>
        </Router>
    )
}

export default App