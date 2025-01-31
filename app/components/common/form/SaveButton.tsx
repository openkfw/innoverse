import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import * as m from '@/src/paraglide/messages.js';

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
        {m.components_profilePage_form_updateUserForm_save()}
      </Button>
    </Box>
  );
}
