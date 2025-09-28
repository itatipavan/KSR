import { Layout as AntLayout, Menu, Badge } from 'antd';
import { useEffect, useState } from 'react';
import { useCart } from '../store/CartContext.jsx';

const { Header, Content, Footer } = AntLayout;

const navItems = [
  { key: '#/', label: 'Home' },
  { key: '#/catalog', label: 'Catalog' },
  { key: '#/manufactured', label: 'Manufactured' },
  { key: '#/resale', label: 'Resale' },
  { key: '#/branches', label: 'Branches' },
  { key: '#/careers', label: 'Careers' },
];

export default function Layout({ children }) {
  const { items } = useCart();
  const [current, setCurrent] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setCurrent(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <AntLayout className="app-layout">
      <Header className="app-header">
        <div className="brand-title">Ayurvedic Herbals</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          items={navItems}
          onClick={(e) => (window.location.hash = e.key)}
          className="nav-menu"
        />
        <Badge count={items.reduce((s, i) => s + i.qty, 0)}>
          <a className="cart-link" href="#/cart" aria-label="Cart">🛒</a>
        </Badge>
      </Header>
      <Content className="app-content">{children}</Content>
      <Footer className="app-footer">
        <div className="footer-links">
          <a href="#/branches">Store Locator</a>
          <a href="#/careers">Careers</a>
          <a href="#/catalog">Shop</a>
        </div>
        <div>© {new Date().getFullYear()} Ayurvedic Herbals. GMP and AYUSH-compliant manufacturing.</div>
      </Footer>
    </AntLayout>
  );
}
