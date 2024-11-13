import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export function FormSaveButton({ onSave, disabled }: { onSave: () => void; disabled: boolean }) {
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        onClick={onSave}
        variant="contained"
        size="small"
        disabled={disabled}
        sx={{ width: '30%', backgroundColor: 'secondary.main' }}
      >
        Speichern
      </Button>
    </Box>
  );
}
