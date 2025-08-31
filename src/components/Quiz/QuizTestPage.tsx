'use client';
import {
  useGetSubmitUserQuizQuery,
  useSubmitQuizMutation,
} from '@/redux/api/quizSubmitApi';
import { useAppSelector } from '@/redux/hooks';
import { ISingleQuizData } from '@/types/quiz/singleQuizType';
import { ISubmittedUserQuizData } from '@/types/quiz/submittedQuizType';
import { Animation_model_hook, Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Modal } from 'antd';
import { useMemo, useState } from 'react';
import TopBarLoading from '../ui/Loading/TopBarLoading';
import QuizQuestionCard from './QuizQuestionCard';
export default function QuizTestPage({
  quizData,
  quizId,
}: {
  quizData: ISingleQuizData[];
  quizId: string;
}) {
  ///! state of quiz card
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  // const [userResponses, setUserResponses] = useState<any[]>([]);

  const [submitQuiz, { isLoading: submitLoading }] = useSubmitQuizMutation();
  ///! for submit quiz
  const { userAnswers } = useAppSelector((state: any) => state.quiz);

  //! for submitted  getQUiz
  // console.log(quizId, 'quizIdquizIdquizIdquizIdquizId')
  const { data: userSubmitData, isLoading } = useGetSubmitUserQuizQuery(quizId);

  // const userSubmitData = quizAnswerData;

  // console.log(userSubmitData)
  const submittedDefaultData: ISubmittedUserQuizData = userSubmitData?.find(
    (answer: any) => answer?.singleQuiz?._id === currentAnswer?.singleQuiz,
  );

  // ! For Test is submitted Answer is CorrectAnswer;

  const checkAnswers = (
    responseData: ISubmittedUserQuizData & { singleQuizDetails: ISingleQuizData },
  ): boolean => {
    if (responseData?.singleQuizDetails?.type === 'input') {
      const isCorrectInput =
        responseData?.singleQuizDetails?.single_answer === responseData?.submitAnswers[0]
          ? true
          : false;
      return isCorrectInput;
    } else if (
      responseData?.singleQuizDetails?.type === 'select' ||
      responseData?.singleQuizDetails?.type === 'math' ||
      responseData?.singleQuizDetails?.type === 'multiple_select' ||
      responseData?.singleQuizDetails?.type === 'find' ||
      responseData?.singleQuizDetails?.type === 'drag' ||
      responseData?.singleQuizDetails?.type === 'audio'
    ) {
      const allCorrectSelect = responseData?.submitAnswers.every((answerId: string) => {
        const submittedAnswer = responseData?.singleQuizDetails?.answers?.find(
          (answer: any) => answer._id === answerId && answer.correct,
        );

        return submittedAnswer && submittedAnswer.correct;
      });

      return allCorrectSelect;
    }

    return false;
  };

  const submitAnswer = async () => {
    if (currentAnswer?.singleQuiz !== submittedDefaultData?.singleQuiz?._id) {
      const isBeforeCorrect = checkAnswers(currentAnswer);

      if (isBeforeCorrect) {
        currentAnswer['isCorrect'] = 'yes';
      } else {
        currentAnswer['isCorrect'] = 'no';
      }

      try {
        const res = await submitQuiz(currentAnswer).unwrap();

        if (res?.success === false) {
          Error_model_hook(res?.message);
        } else {
          // Check if submitted answers are correct
          const isCorrect = checkAnswers(res);
          if (currentStep + 1 !== quizData?.length) {
            // console.log('equal............')
            return setCurrentStep((prevStep) => prevStep + 1);
          }
          if (isCorrect) {
            Success_model('Answer is Correct');
          } else {
            Animation_model_hook(
              'Opps.. you are submitted wrong answers. Please continue..',
            );
          }
          if (currentStep + 1 !== quizData?.length) {
            // console.log('equal............' )
            return setCurrentStep((prevStep) => prevStep + 1);
          }
        }
      } catch (err: any) {
        console.error(err);
        Error_model_hook(err?.message || err?.data);
      }
    } else {
      // Error_model_hook("Already submitted the answer");
      if (currentStep + 1 !== quizData?.length) {
        // console.log('equal............')
        return setCurrentStep((prevStep) => prevStep + 1);
      }
    }
  };

  // ! For Next quiz and submit Quiz
  const handleNext = () => {
    submitAnswer();
  };

  // console.log(userAnswers)
  // ! For disabled Next Button
  const isDisabledNext = useMemo(() => {
    // console.log(userAnswers)
    const isSelected = userAnswers.find(
      (answer: any) =>
        answer?.index ===
        (currentStep < quizData.length - 1 ? currentStep + 1 : currentStep + 1),
    );

    let disabled = false;

    if (currentAnswer?.singleQuiz === submittedDefaultData?.singleQuiz?._id) {
      // console.log("false ..........");
      disabled = false;
    } else if (isSelected) {
      disabled = false;
    } else {
      disabled = true;
    }
    return disabled;
  }, [
    currentAnswer?.singleQuiz,
    currentStep,
    quizData.length,
    submittedDefaultData?.singleQuiz?._id,
    userAnswers,
  ]);

  // ! for result Show modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleFinishQuiz = () => {
    showModal();
  };

  // ! for result Show Function
  interface AnalysisResult {
    correctAnswers: string[];
    incorrectAnswers: string[];
  }
  // console.log('userSubmitData', userSubmitData)
  function analyzeQuizAnswers(submittedData: any): AnalysisResult {
    const correctAnswersSet: Set<string> = new Set();
    const incorrectAnswersSet: Set<string> = new Set();

    submittedData?.forEach((submission: any) => {
      const { singleQuiz, submitAnswers } = submission;

      if (singleQuiz && submitAnswers) {
        if (
          singleQuiz?.type === 'select' ||
          singleQuiz?.type === 'multiple_select' ||
          singleQuiz?.type === 'math' ||
          singleQuiz?.type === 'find' ||
          singleQuiz?.type === 'drag' ||
          singleQuiz?.type === 'audio'
        ) {
          // For "select" and "multiple_select" types
          singleQuiz?.answers?.forEach((answer: any) => {
            if (submitAnswers?.includes(answer?._id)) {
              if (answer?.correct) {
                if (
                  !correctAnswersSet?.has(singleQuiz?._id) &&
                  !incorrectAnswersSet?.has(singleQuiz?._id)
                ) {
                  correctAnswersSet.add(singleQuiz?._id);
                }
              } else {
                if (
                  !correctAnswersSet?.has(singleQuiz?._id) &&
                  !incorrectAnswersSet?.has(singleQuiz?._id)
                ) {
                  incorrectAnswersSet.add(singleQuiz?._id);
                }
              }
            }
          });
        } else if (singleQuiz?.type === 'input') {
          if (singleQuiz?.single_answer === submitAnswers[0]) {
            correctAnswersSet.add(singleQuiz?._id);
          } else {
            incorrectAnswersSet.add(singleQuiz?._id);
          }
        }
      }
    });

    const correctAnswers = Array.from(correctAnswersSet);
    const incorrectAnswers = Array.from(incorrectAnswersSet);

    return { correctAnswers, incorrectAnswers };
  }

  const result = analyzeQuizAnswers(userSubmitData);

  return (
    <div className="w-full  mx-aut my-5 lg:my-0 ">
      <div className="flex flex-col justify-start  gap-3 mt-4  w-[80 ">
        {/* Render quiz based on the current step */}
        {isLoading && <TopBarLoading />}
        {quizData.length > 0 && (
          <QuizQuestionCard
            quiz={quizData[currentStep]}
            index={currentStep}
            userAnswers={userAnswers}
            currentAnswer={currentAnswer}
            setCurrentAnswer={setCurrentAnswer}
            submittedDefaultData={submittedDefaultData}
            // setUserResponses={setUserResponses}
            // userResponses={userResponses}
          />
        )}
        {/* {
          <DragQUizTest />
        } */}

        <div className="flex justify-between  gap-5 mb-3 px-3 max-w-6">
          <Button
            onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < quizData.length - 1 ? (
            <Button type="default" onClick={handleNext} disabled={isDisabledNext}>
              Next
            </Button>
          ) : (
            <div>
              {quizData?.length !== userSubmitData?.length ? (
                <Button type="default" disabled={isDisabledNext} onClick={handleNext}>
                  Finish Quiz
                </Button>
              ) : (
                // <Button type="default" onClick={handleFinishQuiz}>
                //   See Result
                // </Button>

                <Button type="default" disabled={isDisabledNext} onClick={handleNext}>
                  Finish Quiz
                </Button>
              )}
            </div>
          )}
          <Button type="default" onClick={handleFinishQuiz}>
            See All Result
          </Button>
        </div>

        {/* //! For result container UI */}

        <Modal
          title="Your Result"
          open={isModalOpen}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              {/* <Button>Custom Button</Button>
            <CancelBtn />
            <OkBtn /> */}
              <Button onClick={handleOk}>Ok </Button>
            </>
          )}
          onCancel={handleCancel}
        >
          <div className="">
            <h2 className="text-center my-3">Total Quiz {quizData?.length}</h2>
            <h2 className="text-[1rem] font-serif text-green-600 ">
              Total Correct Answer :{' '}
              <span className="">{result?.correctAnswers?.length}</span>
            </h2>
            <h2 className="text-[1rem] font-serif  text-red-600">
              Total InCorrect Answer :{' '}
              <span className="">{result?.incorrectAnswers?.length}</span>
            </h2>
          </div>
        </Modal>
      </div>
    </div>
  );
}
