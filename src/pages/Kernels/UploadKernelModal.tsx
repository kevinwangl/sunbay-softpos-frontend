/**
 * 上传内核模态框
 */
import React, { useState } from 'react';
import { Modal, Form, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useKernels } from '@/hooks/useKernels';

const { Dragger } = Upload;

interface UploadKernelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UploadKernelModal: React.FC<UploadKernelModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { uploadKernel, uploading } = useKernels();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (fileList.length === 0) {
        message.error('请选择要上传的文件');
        return;
      }

      const file = fileList[0].originFileObj as File;
      await uploadKernel(file, values.version);
      
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      console.error('Failed to upload kernel:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file: File) => {
      // 验证文件类型
      if (!file.name.endsWith('.wasm')) {
        message.error('只能上传 .wasm 文件');
        return false;
      }

      // 验证文件大小（最大50MB）
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        message.error('文件大小不能超过 50MB');
        return false;
      }

      setFileList([
        {
          uid: `${Date.now()}`,
          name: file.name,
          status: 'done',
          originFileObj: file,
        } as UploadFile,
      ]);

      return false; // 阻止自动上传
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <Modal
      title="上传内核"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={uploading}
      width={600}
      okText="上传"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          version: '',
        }}
      >
        <Form.Item
          label="版本号"
          name="version"
          rules={[
            { required: true, message: '请输入版本号' },
            {
              pattern: /^v\d+\.\d+\.\d+$/,
              message: '版本号格式应为 vX.Y.Z，例如：v1.0.0',
            },
          ]}
          extra="版本号格式：vX.Y.Z，例如：v1.0.0"
        >
          <Input placeholder="例如：v1.0.0" />
        </Form.Item>

        <Form.Item
          label="内核文件"
          required
          extra="支持 .wasm 文件，最大 50MB"
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持 WebAssembly (.wasm) 文件
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadKernelModal;
