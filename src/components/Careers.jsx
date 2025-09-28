import { Card, List } from 'antd';

const jobs = [
  { id: 'J01', title: 'Manufacturing Chemist', location: 'Hyderabad (Plant)', link: 'https://example.com/hr/jobs/J01' },
  { id: 'J02', title: 'Store Executive', location: 'Vijayawada Branch', link: 'https://example.com/hr/jobs/J02' },
  { id: 'J03', title: 'Sales Associate', location: 'Jubilee Hills Branch', link: 'https://example.com/hr/jobs/J03' },
];

export default function Careers() {
  return (
    <Card title="Careers">
      <p>Explore opportunities across manufacturing, retail, and administration. Applications are processed via our internal HRM system.</p>
      <List
        dataSource={jobs}
        renderItem={(j) => (
          <List.Item actions={[<a key="apply" href={j.link} target="_blank" rel="noreferrer">Apply</a>] }>
            <List.Item.Meta title={j.title} description={j.location} />
          </List.Item>
        )}
      />
    </Card>
  );
}
