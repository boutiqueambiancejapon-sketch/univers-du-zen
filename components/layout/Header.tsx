import TopBar from './TopBar';
import Nav from './Nav';

export default function Header() {
  return (
    <header className="sticky top-0 z-40">
      <TopBar />
      <Nav />
    </header>
  );
}
