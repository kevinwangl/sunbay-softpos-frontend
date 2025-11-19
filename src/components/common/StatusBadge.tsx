import { Tag } from 'antd';
import { DeviceStatus } from '@/types';
import { DEVICE_STATUS_LABELS, DEVICE_STATUS_COLORS } from '@/utils/constants';

interface StatusBadgeProps {
  status: DeviceStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Tag color={DEVICE_STATUS_COLORS[status]}>
      {DEVICE_STATUS_LABELS[status]}
    </Tag>
  );
};
