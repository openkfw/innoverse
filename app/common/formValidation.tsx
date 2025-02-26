import * as m from '@/src/paraglide/messages.js';

export const required_field = { message: m.components_common_formValidation_messages_required_field() };
export const invalid_date = { message: m.components_common_formValidation_messages_invalid_date() };
export const invalid_file_size = (fileSize: string) => ({
  message: m.components_common_formValidation_messages_invalid_file_size({ fileSize }),
});
