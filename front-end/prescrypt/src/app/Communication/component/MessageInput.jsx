"use client";
import { useRef, useState, useEffect } from "react";
import { Image, Send, Smile, X, Loader2 } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import * as signalR from "@microsoft/signalr";
const MessageInput = ({
  selectedUser,
  fetchMessages,
  userId,
  fetchUsers,
  connection,
}) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to read image");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);

    const messagePayload = {
      senderId: userId,
      receiverId: selectedUser.receiverId,
      text: text.trim(),
      image: imagePreview || null,
    };

    try {
      console.log("📤 Sending message:", messagePayload);

      if (
        !connection ||
        connection.state !== signalR.HubConnectionState.Connected
      ) {
        toast.error("Not connected to chat server");
        console.error("Connection state:", connection?.state);
        return;
      }

      await connection.invoke("SendMessage", messagePayload);
      toast.success("Message sent!");

      console.log("✅ Message sent via SignalR");

      await fetchMessages();
      await fetchUsers();

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message");
    }finally{
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="relative w-full p-5 bg-base-100 shadow-inner rounded-t-lg">
      {imagePreview && (
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-24 h-24">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover w-full h-full rounded-lg border border-zinc-700 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300 hover:bg-base-200 transition-colors flex items-center justify-center text-zinc-700 shadow-md"
              type="button"
              aria-label="Remove image preview"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={emojiPickerRef}
            className="absolute z-50 bottom-20 left-4 shadow-lg rounded-xl border border-zinc-700 bg-base-100"
            style={{ width: 320 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex items-center flex-1 gap-3">
          <textarea
            rows={1}
            onKeyDown={handleKeyDown}
            className="w-full py-2 px-2 rounded-xl input input-bordered input-md resize-none focus:outline-none border border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            title="Attach image"
            className={`p-3 flex items-center justify-center transition-colors cursor-pointer rounded-lg ${
              imagePreview
                ? "text-emerald-600 hover:bg-emerald-100"
                : "text-zinc-400 hover:bg-zinc-200"
            }`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
          >
            <Image className="w-6 h-6" />
          </button>

          <button
            type="button"
            title="Toggle emoji picker"
            className="btn btn-circle p-3 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer rounded-lg"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            aria-label="Toggle emoji picker"
          >
            <Smile className="w-6 h-6" />
          </button>
        </div>

        <button
          type="submit"
          disabled={isSending || (!text.trim() && !imagePreview)}
          aria-label="Send message"
          title="Send"
          className={`btn h-12 min-h-0 px-6 rounded-xl transition duration-150 ease-in-out ${
            text.trim() || imagePreview
              ? "shadow-lg hover:bg-emerald-200 active:bg-emerald-300 active:shadow-md"
              : "disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 hover:bg-zinc-200"
          }`}
        >
          {isSending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
