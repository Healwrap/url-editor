import React, { useEffect, useState } from "react";
import { Button, List, Pagination, message } from "antd";
import { CopyOutlined, LinkOutlined } from "@ant-design/icons";

const App: React.FC = () => {
  const [links, setLinks] = useState<{ url: string; key: number }[]>([]);

	useEffect(() => {
		
	}, []);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchLinks = () => {
    const iframes = document.querySelectorAll("iframe");
		const links = Array.from(iframes).map((iframe) => iframe.src);
		setLinks(links.map((item, index) => ({ url: item, key: index })));
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success("链接已复制");
  };

  const handleJump = (url: string) => {
    window.open(url, "_blank");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedLinks = links.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
		<div style={{ padding: 20 }}>
			<Button type="primary" onClick={fetchLinks}>
				获取链接列表
			</Button>
			<List
				itemLayout="horizontal"
				dataSource={paginatedLinks}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Button
								icon={<CopyOutlined />}
								onClick={() => handleCopy(item.url)}
							>
								复制
							</Button>,
							<Button
								icon={<LinkOutlined />}
								onClick={() => handleJump(item.url)}
							>
								跳转
							</Button>,
						]}
					>
						<List.Item.Meta
							title={
								<div
									style={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									{item.url}
								</div>
							}
						/>
					</List.Item>
				)}
			/>
			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={links.length}
				onChange={handlePageChange}
				style={{ marginTop: 20, textAlign: "center" }}
			/>
		</div>
	);
};

export default App;