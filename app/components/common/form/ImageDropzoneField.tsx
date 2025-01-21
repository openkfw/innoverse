import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller } from 'react-hook-form';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { FormInputProps } from '@/common/formTypes';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import ImagePreview from './ImagePreview';

interface ImageDropzoneFieldProps extends FormInputProps {
  setValue: (name: any, value: File | null, options?: { shouldDirty: boolean }) => void;
}

export const ImageDropzoneField = ({ name, control, setValue }: ImageDropzoneFieldProps) => {
  const [file, setFile] = useState<string | null>();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles) {
        const file = acceptedFiles[0];
        setFile(URL.createObjectURL(file));
        setValue(name, file, { shouldDirty: true });
      }
    },
    [name, setValue],
  );

  const onCancel = () => {
    setFile(null);
    setValue(name, null, { shouldDirty: true });
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, value } }) => (
        <>
          <Dropzone
            onDrop={async (acceptedFiles: File[]) => {
              onDrop(acceptedFiles);
            }}
            accept={{ 'image/*': [] }}
            multiple={false}
          >
            {({ getRootProps, getInputProps, isFocused }) => {
              const style = {
                ...baseStyle,
                ...(isFocused ? focusedStyle : {}),
              };

              return (
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} onBlur={onBlur} />
                  <Box sx={boxStyles}>
                    <CloudUploadIcon />
                    <Typography variant="body1" color="common.white">
                      {m.components_profilePage_form_updateUserForm_placeholder()}
                    </Typography>
                  </Box>
                </div>
              );
            }}
          </Dropzone>
          {(file && <ImagePreview file={file} onCancel={onCancel} />) ||
            (value && <ImagePreview file={value} onCancel={onCancel} />)}
        </>
      )}
    />
  );
};

const boxStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 1,
};

const baseStyle: React.CSSProperties = {
  alignItems: 'center',
  padding: '20px',
  borderWidth: 1.5,
  borderRadius: 2,
  borderStyle: 'dashed',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  color: theme.palette.common.white,
};

const focusedStyle = {
  borderColor: theme.palette.secondary.main,
};
