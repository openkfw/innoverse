import React from 'react';
import Image from 'next/image';

import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material/styles';

import theme from '@/styles/theme';

type ImagePreviewProps = {
  file: string;
  onCancel: () => void;
};

export default function ImagePreview(props: ImagePreviewProps) {
  const { file, onCancel } = props;

  return (
    <Box sx={thumbStyle}>
      <Image src={file} alt="preview" style={img} layout="fill" />
      <CancelIcon sx={closeIconStyle} onClick={onCancel} aria-label="close dialog" />
    </Box>
  );
}

const thumbStyle = {
  borderRadius: 2,
  border: `1px solid ${theme.palette.common.white}`,
  marginBottom: 8,
  marginRight: 8,
  width: 80,
  height: 80,
  padding: 4,
  boxSizing: 'border-box',
  position: 'relative',
};

const img = {
  borderRadius: 100,
};

const closeIconStyle: SxProps = {
  top: 0,
  right: '5px',
  position: 'absolute',
  cursor: 'pointer',
  color: 'common.white',
  width: '20px',
};
