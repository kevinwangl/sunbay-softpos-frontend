import { Modal, Form, Radio, Input, message } from 'antd';
import { useEffect } from 'react';
import { SDKVersion } from '@/types';
import { useUpdateSDKVersion } from '@/hooks/useSDKVersions';

interface EditVersionModalProps {
  visible: boolean;
  version: SDKVersion | null;
  onClose: () => void;
}

const EditVersionModal: React.FC<EditVersionModalProps> = ({
  visible,
  version,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { mutate: updateVersion, isPending } = useUpdateSDKVersion();

  useEffect(() => {
    if (version && visible) {
      form.setFieldsValue({
        updateType: version.updateType,
        status: version.status,
        releaseNotes: version.releaseNotes,
      });
    }
  }, [version, visible, form]);

  const handleSubmit = async () => {
    if (!version) return;

    try {
      const values = await form.validateFields();
      updateVersion(
        { id: version.id, data: values },
        {
          onSuccess: () => {
            message.success('版本更新成功');
            form.resetFields();
            onClose();
          },
        }
      );
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title="编辑SDK版本"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      confirmLoading={isPending}
      width={600}
    >
      {version && (
        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>版本号：</strong>
            {version.version}
          </p>
          <p>
            <strong>发布时间：</strong>
            {new Date(version.releasedAt).toLocaleString('zh-CN')}
          </p>
        </div>
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          name="updateType"
          label="更新类型"
          rules={[{ required: true, message: '请选择更新类型' }]}
        >
          <Radio.Group>
            <Radio value="FORCE">强制更新</Radio>
            <Radio value="OPTIONAL">可选更新</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="status"
          label="版本状态"
          rules={[{ required: true, message: '请选择版本状态' }]}
        >
          <Radio.Group>
            <Radio value="ACTIVE">活跃</Radio>
            <Radio value="MAINTENANCE">维护</Radio>
            <Radio value="DEPRECATED">废弃</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="releaseNotes"
          label="发布说明"
          rules={[
            { required: true, message: '请输入发布说明' },
            { min: 10, message: '发布说明至少10个字符' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="描述本次更新的内容..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditVersionModal;
