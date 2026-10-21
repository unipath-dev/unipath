
function Navbar() {
  return (
    <header className="navbar">
      <a className="logo" href="#">
        Uni<span>Path</span>
      </a>

      <nav>
        <a href="#universities">Universities</a>
        <a href="#about">About</a>
      </nav>

      <a className="nav-button" href="#universities">
        Explore universities
      </a>
    </header>
  );
}

export default Navbar;
