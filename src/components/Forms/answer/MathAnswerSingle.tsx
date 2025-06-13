/* eslint-disable prettier/prettier */
import MathDisplay from '@/components/Utlis/MathDisplay';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Radio } from 'antd';
import { useState } from 'react';

interface AnswerInputListProps {
  answers: any[];
  setAnswers: (answers: any[]) => void;
}

const MathAnswerSingle: React.FC<AnswerInputListProps> = ({ answers, setAnswers }) => {
  const [fileProgressList, setFileProgressList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<{ loading: boolean; index: number }>({
    loading: false,
    index: 50000,
  });

  const handleAdd = () => {
    setAnswers([
      ...answers,
      {
        title: '',
        correct: false,
        imgs: [],
        serialNumber: answers.length,
        status: 'active',
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const updated = answers.filter((_, i) => i !== index);
    setAnswers(updated);
  };

  const handleChange = (index: number, field: Partial<any>) => {
    let updated = [...answers];
    updated[index] = { ...updated[index], ...field };

    // If correct changed to true, others must be false
    if (field.correct === true) {
      updated = updated.map((a, i) => ({
        ...a,
        correct: i === index,
      }));
    }

    setAnswers(updated);
  };

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ marginBottom: 12 }}>Add Answers</h3>

      {answers.map((answer, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: 12,
            marginBottom: 16,
            position: 'relative',
          }}
        >
          <MinusCircleOutlined
            onClick={() => handleRemove(index)}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: 18,
              color: '#ff4d4f',
              zIndex: 1,
            }}
          />

          <Input.TextArea
            placeholder={`Option ${index + 1} (LaTeX)`}
            value={answer.title}
            onChange={(e) => handleChange(index, { title: e.target.value })}
          />

          <MathDisplay content={answer.title || ''} />

          <Radio
            checked={answer.correct}
            onChange={() => handleChange(index, { correct: true })}
          >
            Mark as Correct
          </Radio>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        style={{
          marginTop: 8,
          background: '#1890ff',
          color: 'white',
          padding: '6px 12px',
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <PlusOutlined /> Add Option
      </button>
    </div>
  );
};

export default MathAnswerSingle;
