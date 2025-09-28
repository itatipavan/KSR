import { Card, Row, Col, Statistic, Button } from 'antd';
import { useAuth } from '../store/AuthContext.jsx';
import { DB } from '../services/storage.js';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const db = DB.get();
  const invoices = db.invoices.filter((i) => !user.branchId || i.branchId === user.branchId || user.role === 'MANUFACTURER_MAIN');

  return (
    <div className="dashboard-section">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card><Statistic title="Role" value={user.role} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Branch" value={user.branchId} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Invoices" value={invoices.length} /></Card></Col>
      </Row>
      <div className="dashboard-actions">
        <Button onClick={() => (window.location.hash = '#/pos')}>Open Billing (POS)</Button>
        <Button onClick={() => (window.location.hash = '#/employees')}>Employees</Button>
        <Button onClick={() => (window.location.hash = '#/payroll')}>Payroll</Button>
        <Button onClick={() => (window.location.hash = '#/vendors')}>Vendors</Button>
        <Button danger onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
