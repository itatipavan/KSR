import { Layout as AntLayout, Menu, Badge } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
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
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="brand-title">Ayurvedic Herbals</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          items={navItems}
          onClick={(e) => (window.location.hash = e.key)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Badge count={items.reduce((s, i) => s + i.qty, 0)}>
          <a className="cart-link" href="#/cart" aria-label="Cart">
            <ShoppingCartOutlined style={{ fontSize: 20, color: '#fff' }} />
          </a>
        </Badge>
      </Header>
      <Content style={{ padding: '24px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        <div className="footer-links">
          <a href="#/branches"><EnvironmentOutlined /> Store Locator</a>
          <a href="#/careers"><TeamOutlined /> Careers</a>
          <a href="#/catalog"><ShopOutlined /> Shop</a>
        </div>
        <div>© {new Date().getFullYear()} Ayurvedic Herbals. GMP and AYUSH-compliant manufacturing.</div>
      </Footer>
    </AntLayout>
  );
}
