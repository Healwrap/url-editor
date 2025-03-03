import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { QRCodeSVG } from "qrcode.react";
import URI from "urijs";

const EditCurrent: React.FC = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [outputUrl, setOutputUrl] = useState("");

  useEffect(() => {
    // 默认取当前页面URL
    setInputUrl(window.location.href);
  }, []);

  const parseUrl = () => {
    const uri = new URI(inputUrl);
    setParams(uri.query(true));
  };

  const addParam = () => {
    setParams({ ...params, "": "" });
  };

  const updateUrl = () => {
    const uri = new URI(inputUrl);
    const newUrl = uri.query(params).toString();
    setOutputUrl(newUrl);
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    message.success("已复制到剪贴板！");
  };

  return (
    <Card title="URL编辑器" style={{ margin: 20 }}>
      <Form layout="vertical">
        <Form.Item label="输入URL">
          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            addonAfter={
              <>
                <Button
                  onClick={() => copyToClipboard(inputUrl)}
                  style={{ marginRight: 8 }}
                >
                  复制
                </Button>
                <Button
                  onClick={() => inputUrl && window.open(inputUrl, "_blank")}
                >
                  新标签页
                </Button>
              </>
            }
          />
        </Form.Item>
        <Button type="primary" onClick={parseUrl}>
          解析URL
        </Button>

        <Card title="调整参数" style={{ marginTop: 20 }}>
          {Object.keys(params).map((key) => (
            <Form.Item label={key} key={key}>
              <Input
                value={params[key]}
                onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                addonAfter={
                  <Button onClick={() => copyToClipboard(params[key])}>
                    复制
                  </Button>
                }
              />
            </Form.Item>
          ))}
          <Button onClick={addParam}>添加新的参数</Button>
        </Card>

        <Card title="输出结果" style={{ marginTop: 20 }}>
          <Button type="primary" onClick={updateUrl}>
            更新URL
          </Button>
          <Input
            style={{ marginTop: 20 }}
            value={outputUrl}
            readOnly
            addonAfter={
              <>
                <Button
                  onClick={() => copyToClipboard(outputUrl)}
                  style={{ marginRight: 8 }}
                >
                  复制
                </Button>
                <Button
                  onClick={() => outputUrl && window.open(outputUrl, "_blank")}
                >
                  新标签页
                </Button>
              </>
            }
          />
          {outputUrl && (
            <div style={{ marginTop: 20 }}>
              <QRCodeSVG value={outputUrl} size={256} />
            </div>
          )}
        </Card>
      </Form>
    </Card>
  );
};

export default EditCurrent;