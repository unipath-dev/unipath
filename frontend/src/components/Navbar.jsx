
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link className="logo" to="/">
        Uni<span>Path</span>
      </Link>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/universities">Universities</NavLink>
        <Link to="/#about">About</Link>
      </nav>

      <Link className="nav-button" to="/universities">
        Explore universities
      </Link>
    </header>
  );
}

export default Navbar;
