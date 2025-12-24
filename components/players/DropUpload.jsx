"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { t } from "@/lib/i18n";
import uploadFile from "@/src/assets/images/license/uploadFile.svg";



function DropUploadBase({
  lang,
  id,
  name,
  accept,
  multiple = false,
  value,
  hasError,
  descKey,
  onFiles,
  children,
}) {
  const hasFile = value && value.length > 0;

  const onDrop = useCallback(
    (acceptedFiles) => onFiles(acceptedFiles),
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    multiple,
    noClick: true,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`file-upload-wrapper ${hasError ? "error-input" : hasFile ? "success-input" : ""} ${isDragActive ? "drag-active" : ""
        }`}
    >
      <input {...getInputProps({ id, name })} />

      <div className="file-upload-label">
        <div className="upload-content">
          <Image src={uploadFile} alt="Upload" className="upload-icon" />
          <p className="upload-text">{isDragActive ? t(lang, "drop_here") : t(lang, descKey)}</p>
          <p className="upload-or">{t(lang, "or")}</p>
          <button type="button" className="browse-btn" onClick={open}>
            {t(lang, "browse_files")}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export const DropUpload = React.memo(DropUploadBase);
