import { Modal, Form, Input, Radio, InputNumber, message } from 'antd';
import { useCreateSDKVersion } from '@/hooks/useSDKVersions';
import { isValidSemanticVersion, isValidMD5 } from '@/utils/versionUtils';
import type { CreateSDKVersionRequest } from '@/types/version';

interface CreateVersionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateVersionModal: React.FC<CreateVersionModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const createVersion = useCreateSDKVersion();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 验证版本号格式
      if (!isValidSemanticVersion(values.version)) {
        message.error('版本号必须符合语义化版本规范（MAJOR.MINOR.PATCH），例如：1.2.0');
        return;
      }

      // 验证MD5格式
      if (!isValidMD5(values.md5)) {
        message.error('MD5校验值必须是32位十六进制字符');
        return;
      }

      const data: CreateSDKVersionRequest = {
        version: values.version,
        updateType: values.updateType,
        downloadUrl: values.downloadUrl,
        fileSize: values.fileSize,
        md5: values.md5.toLowerCase(),
        releaseNotes: values.releaseNotes,
        minApiVersion: values.minApiVersion,
        maxApiVersion: values.maxApiVersion,
      };

      await createVersion.mutateAsync(data);
      form.resetFields();
      onClose();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        message.error('请检查表单填写是否完整');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="发布新SDK版本"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={800}
      confirmLoading={createVersion.isPending}
      okText="发布"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          updateType: 'OPTIONAL',
        }}
      >
        <Form.Item
          name="version"
          label="版本号"
          rules={[
            { required: true, message: '请输入版本号' },
            {
              pattern: /^\d+\.\d+\.\d+$/,
              message: '版本号格式必须为 MAJOR.MINOR.PATCH，例如：1.2.0',
            },
          ]}
          extra="格式：MAJOR.MINOR.PATCH，例如：1.2.0"
        >
          <Input placeholder="例如：1.2.0" />
        </Form.Item>

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
          name="downloadUrl"
          label="下载地址"
          rules={[
            { required: true, message: '请输入下载地址' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
        >
          <Input placeholder="https://example.com/sdk/v1.2.0.apk" />
        </Form.Item>

        <Form.Item
          name="fileSize"
          label="文件大小（字节）"
          rules={[
            { required: true, message: '请输入文件大小' },
            { type: 'number', min: 1, message: '文件大小必须大于0' },
          ]}
          extra="单位：字节（Byte）"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="例如：15728640（15MB）"
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="md5"
          label="MD5校验值"
          rules={[
            { required: true, message: '请输入MD5校验值' },
            { len: 32, message: 'MD5校验值必须是32位字符' },
            {
              pattern: /^[a-fA-F0-9]{32}$/,
              message: 'MD5校验值必须是32位十六进制字符',
            },
          ]}
          extra="32位MD5哈希值"
        >
          <Input placeholder="例如：5d41402abc4b2a76b9719d911017c592" maxLength={32} />
        </Form.Item>

        <Form.Item
          name="minApiVersion"
          label="最低API版本"
          rules={[{ required: true, message: '请输入最低API版本' }]}
          extra="该SDK版本支持的最低API版本"
        >
          <Input placeholder="例如：v1" />
        </Form.Item>

        <Form.Item
          name="maxApiVersion"
          label="最高API版本"
          rules={[{ required: true, message: '请输入最高API版本' }]}
          extra="该SDK版本支持的最高API版本"
        >
          <Input placeholder="例如：v2" />
        </Form.Item>

        <Form.Item
          name="releaseNotes"
          label="发布说明"
          rules={[
            { required: true, message: '请输入发布说明' },
            { min: 10, message: '发布说明至少10个字符' },
            { max: 2000, message: '发布说明不超过2000个字符' },
          ]}
        >
          <Input.TextArea
            rows={6}
            placeholder="请描述本次更新的内容，包括新功能、改进和修复的问题..."
            showCount
            maxLength={2000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVersionModal;
