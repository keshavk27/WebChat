import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../store/slice/message/message.thunk';
import { axiosInstance } from '../../../src/components/utilities/axiosInstance.js';
import { toast } from 'react-hot-toast';

function Sendmessage() {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false); // NEW STATE
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userSlice);

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;

    setIsSending(true); // Start loading

    let payload = {
      recieverId: selectedUser?._id,
    };

    if (file) {
      const formData = new FormData();
      formData.append('docs', file);

      try {
        const response = await axiosInstance.post('/user/uploadfile', formData);
        const { url, fileName, messageType } = response.data?.data || {};

        if (url) {
          payload = {
            ...payload,
            message: url,
            fileName,
            messageType,
          };
        }
      } catch (err) {
        toast.error('File upload failed');
        setIsSending(false);
        return;
      }
    } else {
      payload.message = message;
    }

    dispatch(sendMessageThunk(payload));
    setMessage('');
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsSending(false); // Stop loading
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleCancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
  };

  const renderPreview = () => {
    if (!file || !previewUrl) return null;

  const fileExtension = file.name.split('.').pop().toLowerCase();
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isPdf = fileExtension === 'pdf';
  const isDoc =
    fileExtension === 'doc' ||
    fileExtension === 'docx' ||
    fileExtension === 'txt' ||
    fileExtension === 'ppt' ||
    fileExtension === 'xls' ||
    fileExtension === 'xlsx';

  if (isImage) {
    return (
      <div className="relative mb-2">
        <img src={previewUrl} alt="Preview" className="h-24 rounded shadow" />
        <button
          onClick={handleCancelPreview}
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative mb-2">
        <video src={previewUrl} controls className="h-24 rounded shadow" />
        <button
          onClick={handleCancelPreview}
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  }

  if (isPdf || isDoc) {
    return (
      <div className="relative mb-2 flex items-center gap-3 border rounded p-2 bg-gray-100 shadow-sm">
        <div className="w-12 h-14 bg-white flex items-center justify-center border rounded">
          <span className="text-xl font-bold">
            {fileExtension.toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium truncate max-w-[180px]">{file.name}</p>
          <p className="text-xs text-gray-500">{file.type || 'Document'}</p>
        </div>
        <button onClick={handleCancelPreview} className="text-red-500">
          <FiX size={16} />
        </button>
      </div>
    );
  }

  // Fallback for other files
  return (
    <div className="relative mb-2 p-2 border rounded bg-gray-100 flex justify-between items-center">
      <span className="truncate max-w-[200px]">📎 {file.name}</span>
      <button onClick={handleCancelPreview} className="text-red-500 ml-2">
        <FiX size={16} />
      </button>
    </div>
  );
  };

  return (
    <div className="w-full p-2 flex flex-col gap-1">
      {renderPreview()}

      <div className="flex gap-2 items-center">
        <label className="btn btn-square mb-0.5 cursor-pointer">
          <FiPaperclip />
          <input type="file" className="hidden" onChange={handleFileChange} disabled={isSending} />
        </label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type here..."
          className="input input-bordered w-full"
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          className="btn btn-square mb-0.5"
          disabled={isSending}
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FiSend />
          )}
        </button>
      </div>
    </div>
  );
}

export default Sendmessage;
