import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import ProductList from './components/ProductList.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import BranchLocator from './components/BranchLocator.jsx'
import { CartPage, CheckoutPage } from './components/CartCheckout.jsx'
import Orders from './components/Orders.jsx'
import Careers from './components/Careers.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Employees from './components/Employees.jsx'
import Payroll from './components/Payroll.jsx'
import POS from './components/POS.jsx'
import Invoices from './components/Invoices.jsx'
import { AuthProvider, useAuth } from './store/AuthContext.jsx'

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const route = useMemo(() => {
    const path = hash.replace(/^#/, '')
    const parts = path.split('/').filter(Boolean)
    return { path, parts }
  }, [hash])

  return route
}

export default function App() {
  const { parts } = useHashRoute()

  let content = null
  if (parts.length === 0) content = <Home />
  else if (parts[0] === 'catalog') content = <ProductList />
  else if (parts[0] === 'manufactured') content = <ProductList type="manufactured" />
  else if (parts[0] === 'resale') content = <ProductList type="resale" />
  else if (parts[0] === 'product' && parts[1]) content = <ProductDetail id={parts[1]} />
  else if (parts[0] === 'branches') content = <BranchLocator />
  else if (parts[0] === 'cart') content = <CartPage />
  else if (parts[0] === 'checkout') content = <CheckoutPage />
  else if (parts[0] === 'orders') content = <Orders />
  else if (parts[0] === 'careers') content = <Careers />
  else content = <Home />

  return (
    <Layout>
      {content}
    </Layout>
  )
}
