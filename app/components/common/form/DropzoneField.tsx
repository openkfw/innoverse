import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller } from 'react-hook-form';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { FormInputProps } from '@/common/formTypes';

interface DropzoneFieldProps extends FormInputProps {
  onFileAdded: (fileUrl: string | null) => void;
}

export const DropzoneField = ({ name, control, onFileAdded }: DropzoneFieldProps) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        setPreviewFile(previewUrl);
        onFileAdded(previewUrl);
        return previewUrl;
      }
      onFileAdded(null);
      return null;
    },
    [onFileAdded],
  );

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur } }) => (
          <Dropzone
            onDrop={(acceptedFiles: File[]) => {
              const file = onDrop(acceptedFiles);
              onChange(file);
            }}
            accept={{ 'image/*': [], 'video/*': [] }}
            multiple={false}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Box
                {...getRootProps()}
                sx={{ ...dropzoneStyles, borderColor: isDragActive ? 'primary.main' : 'rgba(0, 0, 0, 0.2)' }}
              >
                <input {...getInputProps()} onBlur={onBlur} />
                <Box sx={boxStyles}>
                  <CloudUploadIcon />
                  <Typography variant="body1" color="rgba(0, 0, 0, 0.56)">
                    Fotos oder Videos hochladen
                  </Typography>
                </Box>
              </Box>
            )}
          </Dropzone>
        )}
      />

      {previewFile && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={previewStyles}>
            {previewFile.includes('video') ? (
              <video controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <source src={previewFile} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewFile} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

const dropzoneStyles = {
  border: '1px dashed',
  borderRadius: '4px',
  padding: '20px',
  marginTop: '10px',
  cursor: 'pointer',
  height: '100px',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  color: 'rgba(0, 0, 0, 0.56)',
  '&:hover': {
    borderColor: 'black',
  },
};

const boxStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 1,
};

const previewStyles = {
  width: '130px',
  height: '80px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
};
