import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller } from 'react-hook-form';
import Image from 'next/image';

import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { FormInputProps } from '@/common/formTypes';

interface ImageDropzoneFieldProps extends FormInputProps {
  // TODO: fix any
  setValue: (name: any, value: File | null) => void;
}

type ImagePreview = {
  file: string;
  onCancel: () => void;
};

export const ImageDropzoneField = ({ name, control, setValue }: ImageDropzoneFieldProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      setValue(name, file);
    }
  }, []);

  const onCancel = () => {
    setValue(name, null);
    setPreviewImage(null);
  };

  return (
    <>
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
              {({ getRootProps, getInputProps }) => (
                <Box {...getRootProps()} sx={{ ...dropzoneStyles, borderColor: 'common.white' }}>
                  <input {...getInputProps()} onBlur={onBlur} />
                  <Box sx={boxStyles}>
                    <CloudUploadIcon />
                    <Typography variant="body1" color="common.white">
                      Foto hochladen
                    </Typography>
                  </Box>
                </Box>
              )}
            </Dropzone>
            {(value && <ImagePreview file={value} onCancel={onCancel} />) ||
              (previewImage && <ImagePreview file={previewImage} onCancel={onCancel} />)}
          </>
        )}
      />
    </>
  );
};

const ImagePreview = ({ file, onCancel }: ImagePreview) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={previewStyles}>
        <Image src={file} alt="preview" width={0} height={0} style={{ width: '100%', height: 'auto' }} unoptimized />
      </Box>
      <CancelIcon sx={closeIconStyle} onClick={onCancel} aria-label="close dialog" />
    </Box>
  );
};

const dropzoneStyles = {
  border: '1px dashed',
  borderRadius: '4px',
  padding: '20px',
  marginTop: '10px',
  cursor: 'pointer',
  height: '200px',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  color: 'common.white',
};

const boxStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 1,
};

const previewStyles = {
  width: '120px',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: 'common.white',
};

const closeIconStyle: SxProps = {
  cursor: 'pointer',
  color: 'common.white',
  marginLeft: '-26.5px',
  marginTop: '-13.5px',
  width: '20px',
};
