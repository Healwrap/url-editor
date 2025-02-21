import React, { useState } from "react";
import { Button, Modal, Tabs } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import styles from "./content.module.scss";
import EditCurrent from "./pages/edit-current/index.tsx";
import GetIframe from "./pages/get-iframe/index.tsx";

const { TabPane } = Tabs;

const UrlEditor: React.FC = () => {
	const [openModal, setOpenModal] = useState(false);

	return (
		<div className={styles.widget} style={{ padding: 20 }}>
			<div className={styles.inner}>
				<Button
					className={styles.floatButton}
					type="primary"
					shape="circle"
					onClick={() => setOpenModal(true)}
				>
					<ToolOutlined />
				</Button>

				<Modal
					classNames={{ content: styles.editModal, body: styles.editModalBody }}
					title="URL编辑器"
					open={openModal}
					footer={null}
					width={800}
					maskClosable={false}
					onCancel={() => setOpenModal(false)}
					centered
					focusTriggerAfterClose
				>
					<Tabs defaultActiveKey="1">
						<TabPane tab="编辑当前页面" key="1">
              <EditCurrent></EditCurrent>
						</TabPane>
						<TabPane tab="获取免登链接" key="2">
							{/* 页面2的内容 */}
							<p>这是页面2的内容</p>
						</TabPane>
						<TabPane tab="获取iframe链接" key="3">
              <GetIframe></GetIframe>
						</TabPane>
						<TabPane tab="相关文档" key="4">
							{/* 页面3的内容 */}
							<p>这是页面3的内容</p>
						</TabPane>
					</Tabs>
				</Modal>
			</div>
		</div>
	);
};

export default UrlEditor;
