import logo from "../assets/logo.png";

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="brand">
        <img src={logo} alt="Pixell River Financial Logo" className="logo" />
        <div className="brand-text">
          <strong>Pixell River Financial</strong>
          <span className="tagline">People &amp; Organization</span>
        </div>
      </div>

      <nav aria-label="Primary">
        <ul className="nav-list">
          <li><a href="#" aria-current="page">Employees</a></li>
          <li><a href="#">Organization</a></li>
        </ul>
      </nav>
    </header>
  );
}