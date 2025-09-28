import { Card, Col, Row } from 'antd';

export default function Home() {
  return (
    <div className="home-section">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Our Process">
            <p>From ethically sourced herbs and cold-pressed oils to validated formulations, our GMP facility ensures potency and safety at every step.</p>
            <ul>
              <li>Raw herb identification and testing</li>
              <li>Controlled extraction and standardization</li>
              <li>Batch Manufacturing Record (BMR) maintained for traceability</li>
              <li>FEFO-based dispatch and expiry controls</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Quality & Compliance">
            <p>We adhere to AYUSH and GMP guidelines. Each product batch carries complete QC documentation with expiry and lot tracking.</p>
            <ul>
              <li>GMP-compliant facility</li>
              <li>AYUSH regulatory alignment</li>
              <li>QC checks on raw and finished goods</li>
              <li>End-to-end batch traceability</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
