import { Layout as AntLayout, Menu, Badge, Drawer, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useCart } from '../store/CartContext.jsx';

const { Header, Content, Footer, Sider } = AntLayout;

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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setCurrent(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goto = (key) => {
    window.location.hash = key;
    setMobileOpen(false);
  };

  return (
    <AntLayout className="app-layout">
      <Header className="app-header">
        <Button className="mobile-menu-button" type="text" onClick={() => setMobileOpen(true)} aria-label="Open Menu">☰</Button>
        <div className="brand-title">Ayurvedic Herbals</div>
        <div className="header-spacer" />
        <Badge count={items.reduce((s, i) => s + i.qty, 0)}>
          <a className="cart-link" href="#/cart" aria-label="Cart">🛒</a>
        </Badge>
      </Header>

      <AntLayout className="app-shell">
        <Sider className="app-sider" breakpoint="lg" collapsedWidth={0} width={220} theme="light">
          <div className="sider-section">Browse</div>
          <Menu
            mode="inline"
            selectedKeys={[current]}
            items={navItems}
            onClick={(e) => goto(e.key)}
          />
        </Sider>
        <Content className="app-content">{children}</Content>
      </AntLayout>

      <Footer className="app-footer">
        <div className="footer-links">
          <a href="#/branches">Store Locator</a>
          <a href="#/careers">Careers</a>
          <a href="#/catalog">Shop</a>
        </div>
        <div>© {new Date().getFullYear()} Ayurvedic Herbals. GMP and AYUSH-compliant manufacturing.</div>
      </Footer>

      <Drawer className="mobile-drawer" title="Menu" placement="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Menu
          mode="inline"
          selectedKeys={[current]}
          items={navItems}
          onClick={(e) => goto(e.key)}
        />
        <div className="drawer-cart">
          <a className="cart-link" href="#/cart" onClick={() => setMobileOpen(false)}>🛒 Cart ({items.reduce((s, i) => s + i.qty, 0)})</a>
        </div>
      </Drawer>
    </AntLayout>
  );
}
