import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller } from 'react-hook-form';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { FormInputProps } from '@/common/formTypes';

export const DropzoneField = ({ name, control }: FormInputProps) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      console.log('previewUrl', previewUrl);
      setPreviewFile(previewUrl);
      return file;
    }
    return null;
  }, []);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur } }) => (
          <Dropzone
            onDrop={(acceptedFiles: File[]) => {
              const file = onDrop(acceptedFiles);
              if (file) {
                onChange(file); 
              }
            }}
            accept={{
              'image/*': [], 
              'video/*': [], 
            }}
            multiple={false} 
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Box
                {...getRootProps()}
                sx={{
                  border: '1px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'rgba(0, 0, 0, 0.2)',
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
                }}
              >
                <input {...getInputProps()} onBlur={onBlur} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 1,
                  }}
                >
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
          <Box
            sx={{
              width: '130px',
              height: '80px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
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
