import React, { useEffect, useState } from "react";
import Button from "./Button";
import Icons from "./Icons";

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Delete Item",
}) => {
  const [confirmNumber, setConfirmNumber] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setConfirmNumber(Math.floor(1000 + Math.random() * 9000)); // 4-digit random
      setInputValue("");
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender && !open) return null;

  const isMatch = Number(inputValue) === confirmNumber;

  const handleConfirm = () => {
    if (!isMatch) return;
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/30 ${open ? "animate-overlay-in" : "animate-overlay-out"}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-sm bg-white rounded-sm shadow-lg border border-gray-200 ${open ? "animate-modal-in" : "animate-modal-out"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <Icons name="Trash2" size={15} color="red" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          </div>
          <button onClick={onClose}>
            <Icons
              name="X"
              size={15}
              className="text-gray-400 hover:text-gray-600"
            />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-gray-500">
            This action is{" "}
            <span className="font-medium text-gray-700">permanent</span> and
            cannot be undone. Type{" "}
            <span className="font-semibold text-red-500">{confirmNumber}</span>{" "}
            to confirm.
          </p>

          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type ${confirmNumber} to confirm`}
            className="w-full text-sm border border-gray-200 rounded-sm px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-sm">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={!isMatch || loading}
            // className="bg-red-700  text-white "
            leftIcon={() =>
              loading ? (
                <Icons
                  name="Loader2"
                  size={15}
                  color="white"
                  className="animate-spin"
                />
              ) : null
            }
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
