'use client';
import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
import { ErrorModal } from '@/utils/modalHook';
import { useEffect, useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';
import VoiceLoading from '../ui/Loading/VoiceLoading';

const AudioRecordV2 = ({ audioFileLiveUrlRef, form, isReset }: any) => {
  /*  
 const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder; //recorderControls
   */
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err), // Handle not allowed or not found errors
  );

  const [isLoading, setIsLoading] = useState(false);

  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

  const handleStop = async (blob: any) => {
    setIsLoading(true);
    const audioFile = new File([blob], `audio-message-${crypto.randomUUID()}.mp3`, {
      type: 'audio/mp3', // Change to mp3 for the file type
    });

    try {
      const audioFileData = await multipleFilesUploaderS3([audioFile]);
      console.log('🚀 ~ handleStop ~ audioFileData:', audioFileData);

      if (audioFileData[0] && audioFileLiveUrlRef) {
        audioFileLiveUrlRef.current = audioFileData[0];
        //@ts-ignore
        setMediaBlobUrl(URL.createObjectURL(blob)); // Set the blob URL for playback
      }
    } catch (error) {
      console.error('🚀 ~ handleStop ~ error:', error);
      ErrorModal(error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(isLoading);
  // Reset the media blob URL when the component unmounts
  useEffect(() => {
    if (isReset?.current) {
      setMediaBlobUrl(null);
    }
  }, [isReset?.current]);

  return (
    <div className="flex items-center rounded-md border-gray-300 p-1">
      {
        <AudioRecorder
          onRecordingComplete={handleStop}
          recorderControls={recorderControls}
          showVisualizer={true}
          // downloadOnSavePress={true} // Enable download on save
          // downloadFileExtension="mp3" // Set the download file extension to mp3
          mediaRecorderOptions={{
            audioBitsPerSecond: 128000, // Set audio bits per second
          }}
        />
      }
      <div>
        <>
          {isLoading ? (
            <VoiceLoading />
          ) : (
            <div>
              {!recorderControls.isRecording && mediaBlobUrl && (
                <div className="flex items-center space-x-1">
                  <audio src={mediaBlobUrl} controls className="ml-2" />
                  <div
                    onClick={() => {
                      if (form) {
                        form.submit(); // Submit the form
                        setMediaBlobUrl(null); // Clear the blob URL after submission
                      }
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full bg-green-500 p-1.5 text-white"
                  >
                    <FaPaperPlane size={20} />
                  </div>
                  <div
                    onClick={() => {
                      setMediaBlobUrl(null);
                      audioFileLiveUrlRef.current = {}; // Clear the live URL reference
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full bg-red-600 p-1.5 text-white"
                  >
                    <FaTrash size={20} />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default AudioRecordV2;
