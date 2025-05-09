import { FileProgress } from '@/components/ui/FileUploader/FileUploaderUi';
import { FilProgressMultipleFilesUploaderS3 } from '@/utils/handleFileUploderFileProgress';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, Input, Radio, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import SubHeadingUI from '../../ui/dashboardUI/SubHeadingUI';

interface Answer {
  title: string;
  correct: boolean;
  imgs: string[];
  serialNumber: number;
  status: string;
}

interface AnswerInputListProps {
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

const AnswerSInlge: React.FC<AnswerInputListProps> = ({ answers, setAnswers }) => {
  const [fileProgressList, setFileProgressList] = useState<FileProgress[]>([]);
  const [isLoading, setIsLoading] = useState<{
    loading: boolean;
    index: number;
  }>({
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
        serialNumber: 0,
        status: 'active',
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const updatedAnswers = [...answers];

    updatedAnswers.splice(index, 1);
    setAnswers(updatedAnswers);
  };

  const handleChange = (index: number, updatedAnswer: Answer) => {
    let updatedAnswers = [...answers];
    updatedAnswers[index] = updatedAnswer;
    // If the selected answer is correct, set other answers to incorrect
    if (updatedAnswer.correct) {
      updatedAnswers = updatedAnswers.map((answer, i) => ({
        ...answer,
        correct: i === index,
      }));
    } else {
      updatedAnswers[index] = updatedAnswer;
    }
    setAnswers(updatedAnswers);
  };

  return (
    <div className="">
      <SubHeadingUI>Add Answer </SubHeadingUI>
      {answers?.map((answer, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
            margin: '10px 0',
            border: '1px solid gray',
            padding: '10px 8px',
            borderRadius: '4px',
            width: '100%',
          }}
          className="shadow-1"
        >
          <div
            // style={{ display: "flex", marginBottom: 8 }}

            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              width: '100%',
              alignItems: 'start',
              position: 'relative',
              // background: "red",
            }}
            // align="start"
          >
            <MinusCircleOutlined
              style={{
                fontSize: '1.5rem',
                position: 'absolute',
                right: 0,
                top: 0,
              }}
              onClick={() => handleRemove(index)}
            />
            {/* quiz option */}
            <Input
              placeholder="Option Title"
              style={{
                minWidth: '90%',
                height: '2.7rem',
                // background: "blue",
                // boxSizing: "border-box",
              }}
              // width={500}
              value={answer.title}
              onChange={(e) => handleChange(index, { ...answer, title: e.target.value })}
              // defaultValue={index + 1}
            />
            {/* Quiz radio select */}

            <Radio.Group
              onChange={(e) =>
                handleChange(index, { ...answer, correct: e.target.value })
              }
              value={answer.correct}
            >
              <Radio value={true}>Correct</Radio>
              <Radio value={false}>Incorrect</Radio>
            </Radio.Group>
            {/* quiz uploader */}
            <div className="flex flex-wrap items-center justify-start gap-2">
              <Upload
                listType="picture"
                style={{ textAlign: 'start' }}
                showUploadList={true}
                multiple={false}
                // multiple
                // beforeUpload={async (file) => {
                //   setIsLoading({ loading: true, index: index });

                //   const images = answer?.imgs;
                //   const image = await FilProgressMultipleFilesUploaderS3(
                //     [file],
                //     setFileProgressList,
                //   );
                //   setIsLoading({ loading: false, index: index });
                //   if (image.length > 0) {
                //     const imgUrl = image[0].url;
                //     images.push(imgUrl);
                //   }
                //   // console.log(images,imgUrl, answer);

                //   handleChange(index, {
                //     ...answer,
                //     // imgs: [...answer.imgs,imgUrl],
                //     imgs: images,
                //   });
                //   return false; // Prevent default upload behavior
                // }}
                accept="image/*"
                onChange={async (info: UploadChangeParam<UploadFile>) => {
                  console.log('🚀 ~ onChange={ ~ info:', info);
                  //@ts-ignore
                  const images = answer?.imgs;
                  if (info.fileList.length === 0) {
                    handleChange(index, {
                      ...answer,
                      // imgs: [...answer.imgs,imgUrl],
                      imgs: images,
                    });
                  } else {
                    setIsLoading({ loading: true, index: index });
                    const result = await FilProgressMultipleFilesUploaderS3(
                      info.fileList,
                      setFileProgressList,
                    );
                    console.log('🚀 ~ onChange={ ~ result:', result);
                    handleChange(index, {
                      ...answer,
                      // imgs: [...answer.imgs,imgUrl],
                      imgs: result.map((img) => img.url),
                    });
                    setIsLoading({ loading: false, index: index });
                  }
                }}
                beforeUpload={() => false}
              >
                <Button
                  // disabled={answer?.imgs?.length > 0}
                  loading={isLoading.index === index && isLoading.loading}
                  style={{ textAlign: 'start' }}
                >
                  Answer Image +
                </Button>
              </Upload>
              {answer?.imgs?.map((img, key) => (
                <Image
                  key={key}
                  className="h-10 w-10 rounded"
                  src={img}
                  width={50}
                  height={40}
                  alt=""
                />
              ))}
            </div>
            {/* serial number */}
            <div className="text-start">
              <p>Serial number</p>
              <Input
                placeholder="Serial Number"
                type="number"
                value={answer?.serialNumber ? answer?.serialNumber : index + 1}
                defaultValue={index + 1}
                onChange={(e) =>
                  handleChange(index, {
                    ...answer,
                    serialNumber: +e.target.value,
                  })
                }
                style={{
                  width: '8rem',
                }}
                onWheel={(e) => e.preventDefault()}
              />
            </div>

            {/* select status */}
            {/* <Select
              style={{ width: 120 }}
              onChange={(value) => handleChange(index, { ...answer, status: value })}
              defaultValue={answer.status}
            >
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="deactivate">Deactivate</Select.Option>
            </Select> */}
          </div>
        </div>
      ))}
      <Button
        type="dashed"
        // disabled={answers?.length > 6 ? true : false}
        onClick={handleAdd}
        // block
        icon={<PlusOutlined />}
      >
        {/* {answers?.length < 7 ? "Add Answer" : "Already added 6"} */}
        Add Answer
      </Button>
    </div>
  );
};

export default AnswerSInlge;
