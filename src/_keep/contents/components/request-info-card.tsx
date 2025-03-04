import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';

interface RequestInfo {
  type: string;
  data: chrome.webRequest.WebResponseDetails;
}

const RequestInfoCard: React.FC = () => {
  const [requests, setRequests] = useState<chrome.webRequest.WebResponseDetails[]>([]);

  useEffect(() => {
    const handleRequest = (request: RequestInfo) => {
      setRequests((prevRequests) => [...prevRequests, request.data]);
    };

    chrome.runtime.onMessage.addListener(handleRequest);

    return () => {
      chrome.runtime.onMessage.removeListener(handleRequest);
    };
  }, []);

  return (
    <Card title="页面请求信息" className="request-info-card">
      <List
        dataSource={requests}
        renderItem={(req, index) => (
          <List.Item key={index}>
            <Card type="inner" title={`请求 ${index + 1}`}>
              <p>数据: {JSON.stringify(req, null, 2)}</p>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RequestInfoCard;