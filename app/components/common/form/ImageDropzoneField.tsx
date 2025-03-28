import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller } from 'react-hook-form';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

import { FormInputProps } from '@/common/formTypes';
import { invalid_file_size } from '@/common/formValidation';
import { clientConfig } from '@/config/client';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { bytesToMegabytes } from '@/utils/helpers';

import ImagePreview from './ImagePreview';

interface ImageDropzoneFieldProps extends FormInputProps {
  setValue: (name: any, value: Blob | null, options?: { shouldDirty: boolean }) => void;
}

export const ImageDropzoneField = ({ name, control, setValue }: ImageDropzoneFieldProps) => {
  const [file, setFile] = useState<string | null>();

  const onDrop = useCallback(
    (acceptedFiles: Blob[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const blobFile = new Blob([file], { type: file.type });
        setFile(URL.createObjectURL(blobFile));
        setValue(name, blobFile, { shouldDirty: true });
      }
    },

    [name, setValue],
  );

  const onCancel = () => {
    setFile(null);
    setValue(name, null, { shouldDirty: true });
  };

  const fileValidator = (file: Blob) => {
    if (bytesToMegabytes(file.size) > clientConfig.NEXT_PUBLIC_BODY_SIZE_LIMIT) {
      return {
        code: 'invalid-file-size',
        message: invalid_file_size(clientConfig.NEXT_PUBLIC_BODY_SIZE_LIMIT).message,
      };
    }
    return null;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, value } }) => (
        <>
          <Dropzone
            onDrop={async (acceptedFiles) => {
              onDrop(acceptedFiles);
            }}
            validator={fileValidator}
            accept={{ 'image/*': [] }}
            multiple={false}
          >
            {({ getRootProps, getInputProps, isFocused, isDragReject, fileRejections }) => {
              const style = {
                ...baseStyle,
                ...(isFocused && focusedStyle),
                ...(isDragReject && rejectedStyle),
              };

              const fileRejectionItems = fileRejections[0]?.errors.map((e) => (
                <FormHelperText key={e.code} sx={{ color: 'common.white', fontWeight: 'bold' }}>
                  {e.message}
                </FormHelperText>
              ));

              return (
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} onBlur={onBlur} />
                  <Box sx={boxStyles}>
                    <CloudUploadIcon />
                    <Typography variant="body1" color="common.white">
                      {m.components_profilePage_form_updateUserForm_placeholder()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {fileRejectionItems}
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

const rejectedStyle = {
  borderColor: theme.palette.error.main,
};
