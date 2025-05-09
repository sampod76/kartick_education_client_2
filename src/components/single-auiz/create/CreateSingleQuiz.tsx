/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import Form from '@/components/Forms/Form';

import FormInput from '@/components/Forms/FormInput';

import { singleQuizTypes } from '@/constants/global';

import { useAddSingleQuizMutation } from '@/redux/api/adminApi/singleQuizApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';

import { Button, Col, Input, Row, Select } from 'antd';
import { useState } from 'react';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import AnswerFind from '@/components/Forms/answer/AnswerFind';
import AnswerMultiple from '@/components/Forms/answer/AnswerMultiple';
import AnswerSInlge from '@/components/Forms/answer/AnswerSingle';
import FormTimePicker from '@/components/Forms/FormTimePicker';
import LabelUi from '@/components/ui/dashboardUI/LabelUi';
import ButtonLoading from '@/components/ui/Loading/ButtonLoading';
import UploadAudioFile from '@/components/ui/UploadAudio';
import UploadMultipalImage from '@/components/ui/UploadMultipalImage';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import timeDurationToMilliseconds from '@/hooks/stringToMiliSecend';
import { IQuizType } from '@/types/quiz/singleQuizType';
import dynamic from 'next/dynamic';
const TextEditor = dynamic(() => import('@/components/shared/TextEditor/TextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
    </div>
  ),
});

const CreateSingleQuiz = ({
  categoryId,
  courseId,
  milestoneId,
  moduleId,
  lessonId,
  quizId,
}: {
  categoryId?: string;
  courseId?: string;
  milestoneId?: string;
  moduleId?: string;
  lessonId?: string;
  lessonTitle?: string;
  quizId?: string;
}) => {
  const { userInfo, userInfoLoading } = useGlobalContext();
  const id = userInfo?.roleBaseUserId;
  let disable = true;
  if (userInfo?.role === 'seller') {
    disable = false;
  }

  const [quizType, setQuizTypes] = useState<IQuizType>('select'); // !  tag selection

  const [isReset, setIsReset] = useState(false);
  const [imageUploadLoading, isImageloading] = useState(false);

  // ! For quiz Answer//

  const [answers, setAnswers] = useState([]); ///! select and multiple select

  const [singleAnswer, setSingleAnswerInput] = useState<string>(''); ///! for input
  //

  const [addSingleQuiz, { isLoading: serviceLoading }] = useAddSingleQuizMutation();

  const onSubmit = async (values: any) => {
    console.log('🚀 ~ onSubmit ~ values:', values);
    // console.log("🚀 ~ onSubmit ~ values:", values);
    if (!quizId) {
      Error_model_hook('Please ensure your are selected quiz');
      return;
    }
    if (answers.length) {
      values['answers'] = answers;
    } else if (singleAnswer) {
      values['single_answer'] = singleAnswer;
    } else {
      Error_model_hook('Please select an answer');
      return;
    }

    if (!quizType) {
      Error_model_hook('Please select an quiz type');
      return;
    }

    if (values?.time_duration) {
      values.time_duration = timeDurationToMilliseconds(values.time_duration);
    } else {
      values.time_duration = 1800000;
    }

    const singleQuizDat: object = {
      ...values,
      category: categoryId,
      course: courseId,
      milestone: milestoneId,
      module: moduleId,
      lesson: lessonId,
      quiz: quizId,
      type: quizType,
    };
    removeNullUndefinedAndFalsey(singleQuizDat);

    // return

    try {
      const res = await addSingleQuiz(singleQuizDat).unwrap();

      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        Success_model('Successfully added the Quiz');
        setIsReset(true);
        setAnswers([]);
      }
      // console.log(res);
    } catch (error: any) {
      Error_model_hook(error?.message);
      console.log(error);
    }
  };

  return (
    <div>
      {quizId ? (
        <div
          style={{
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '1rem',
            backgroundColor: 'white',
            padding: '1rem',
          }}
        >
          <Form
            submitHandler={onSubmit}
            isReset={isReset}
            // defaultValues={{ status: ENUM_STATUS.ACTIVE }}
          >
            <h1 className="mb-2 border-spacing-4 border-b-2 text-center text-xl font-bold">
              Create A Single Quiz
            </h1>
            <div
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '10px',
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col
                  className="gutter-row"
                  xs={12}
                  md={4}
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  <LabelUi>
                    Please select quiz type <span className="text-red-500">*</span>
                  </LabelUi>

                  {/* /// ! Quiz Types */}
                  <Select
                    placeholder="Select Quiz Types"
                    style={{ width: '100%' }}
                    onChange={(value: any) => setQuizTypes(value)}
                    size="large"
                    defaultValue={'select'}
                  >
                    {singleQuizTypes.map((item: any, i: number) => {
                      return (
                        <Select.Option value={item} key={i}>
                          {item}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Col>
                <Col
                  className="gutter-row"
                  xs={24}
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  <FormInput
                    type="text"
                    name="title"
                    size="large"
                    label="Quiz Title"
                    required={true}
                  />
                </Col>

                <Col
                  className="gutter-row"
                  xs={12}
                  md={8}
                  style={{
                    marginTop: '8px',
                  }}
                >
                  <FormInput
                    type="number"
                    name="serialNumber"
                    size="large"
                    label="Serial number"
                    // required={true}
                  />
                </Col>

                <Col
                  className="gutter-row"
                  xs={12}
                  md={8}
                  style={{
                    marginBottom: '10px',
                    marginTop: '8px',
                  }}
                >
                  <FormTimePicker name="time_duration" label="Time Duration" />
                </Col>

                <Col
                  hidden={quizType === 'audio' ? true : false}
                  className="gutter-row"
                  xs={24}
                  style={{
                    margin: '20px 0',
                  }}
                >
                  <LabelUi>Select Quiz Question images (optional)</LabelUi>
                  <UploadMultipalImage
                    isImageloading={isImageloading}
                    isReset={isReset}
                    name="imgs"
                  />
                </Col>
                <Col
                  hidden={quizType !== 'audio' ? true : false}
                  className="gutter-row"
                  xs={24}
                  style={{
                    margin: '20px 0',
                  }}
                >
                  <LabelUi>Add Your Audio Quiz</LabelUi>
                  <UploadAudioFile
                    isReset={isReset}
                    fileType="audio"
                    name="quizData.link"
                  />
                </Col>
              </Row>

              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{
                  marginBlock: '2em',
                }}
              >
                <Col
                  className="gutter-row"
                  xs={24}
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  {quizType === 'select' && (
                    <AnswerSInlge answers={answers} setAnswers={setAnswers as any} />
                  )}
                  {quizType === 'multiple_select' && (
                    <AnswerMultiple
                      answersMultiple={answers}
                      setAnswersMultiple={setAnswers as any}
                    />
                  )}
                  {quizType === 'find' && (
                    <AnswerFind
                      answersFind={answers}
                      setAnswersFind={setAnswers as any}
                    />
                  )}
                  {/* //! should update cause it is statics */}
                  {quizType === 'drag' && (
                    <AnswerMultiple
                      answersMultiple={answers}
                      setAnswersMultiple={setAnswers as any}
                    />
                  )}
                  {quizType === 'audio' && (
                    <AnswerMultiple
                      answersMultiple={answers}
                      setAnswersMultiple={setAnswers as any}
                    />
                  )}
                  {quizType === 'input' && (
                    <>
                      <LabelUi>
                        Answer <span className="text-red-700">*</span>
                      </LabelUi>
                      <Input
                        placeholder="Type the answer"
                        style={{
                          width: '70%',
                        }}
                        onBlur={(value: any) => setSingleAnswerInput(value.target.value)}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </div>
            <div className="flex items-center justify-center">
              {serviceLoading ? (
                <ButtonLoading />
              ) : (
                <Button
                  htmlType="submit"
                  size="large"
                  style={{ width: '10rem' }}
                  type="default"
                >
                  {' '}
                  Create
                </Button>
              )}
            </div>
          </Form>
        </div>
      ) : (
        <div className="flex h-full min-h-64 w-full items-center justify-center">
          <h1 className="text-center text-2xl font-semibold text-red-500">
            First select your quiz by filtering{' '}
          </h1>
        </div>
      )}
    </div>
  );
};

export default CreateSingleQuiz;
