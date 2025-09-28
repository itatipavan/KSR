import { Card, Form, Input, Button, Alert } from 'antd';
import { useState } from 'react';
import { useAuth } from '../store/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const onFinish = async (values) => {
    setError('');
    try {
      await login(values.email, values.password);
      window.location.hash = '#/dashboard';
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Card title="Sign in">
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 12 }} />}
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">Login</Button>
      </Form>
    </Card>
  );
}
