import { Tag } from 'antd';
import { SECURITY_SCORE_LEVELS } from '@/utils/constants';

interface SecurityScoreProps {
  score: number;
  showLabel?: boolean;
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({ score, showLabel = true }) => {
  const getScoreLevel = (score: number) => {
    if (score >= SECURITY_SCORE_LEVELS.EXCELLENT.min) return SECURITY_SCORE_LEVELS.EXCELLENT;
    if (score >= SECURITY_SCORE_LEVELS.GOOD.min) return SECURITY_SCORE_LEVELS.GOOD;
    if (score >= SECURITY_SCORE_LEVELS.WARNING.min) return SECURITY_SCORE_LEVELS.WARNING;
    return SECURITY_SCORE_LEVELS.DANGER;
  };

  const level = getScoreLevel(score);

  return (
    <span>
      <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '8px' }}>
        {score}
      </span>
      {showLabel && <Tag color={level.color}>{level.label}</Tag>}
    </span>
  );
};
