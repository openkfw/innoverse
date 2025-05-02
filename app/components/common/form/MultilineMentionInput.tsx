import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Mention, MentionsInput, MentionsInputStyle, SuggestionDataItem } from 'react-mentions';

import Box from '@mui/material/Box';

import { useMentions } from '@/app/contexts/mentions-context';
import { MultilineFormInputProps } from '@/common/formTypes';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { fetchMentionData } from '@/utils/requests/innoUsers/requests';

type MentionCallbackType = (data: SuggestionDataItem[]) => void;

function MultilineMentionInput({
  control,
  name,
  placeholder,
  readOnly = false,
  endAdornment,
  rows = 4,
}: MultilineFormInputProps) {
  const { mentions, setMentions } = useMentions();
  const loading = m.components_common_form_MultilineMentionInput_loading();

  function fetchAndFilterMentionData(search: string, callback: MentionCallbackType) {
    if (mentions === null) {
      callback([{ id: 'loading', display: loading }]);
      fetchMentionData(search).then((fetchedUsers) => {
        const suggestionData = fetchedUsers.map((user) => ({
          id: user.username,
          display: user.username,
        }));
        setMentions(fetchedUsers);
        callback(suggestionData);
      });
    } else {
      const suggestionData = mentions
        .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
        .map((user) => ({
          id: user.username,
          display: user.username,
        }));

      callback(suggestionData);
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <Box sx={mentionInputStyle.wrapperStyles}>
            <MentionsInput
              {...field}
              placeholder={placeholder}
              spellCheck="false"
              readOnly={readOnly}
              rows={rows}
              style={{
                ...mentionInputStyle.mentionsInput,
                paddingBottom: endAdornment ? '56px' : '16px',
              }}
            >
              <Mention
                style={mentionInputStyle.highlightedInput}
                trigger="@"
                displayTransform={(username: string) => `@${username}`}
                appendSpaceOnAdd={true}
                markup="@[__display__]"
                data={fetchAndFilterMentionData}
                renderSuggestion={(
                  suggestion: SuggestionDataItem,
                  _search: string,
                  _highlightedDisplay: ReactNode,
                  _index: number,
                  focused: boolean,
                ) => {
                  if (suggestion.id === 'loading') {
                    return <div>{loading}</div>;
                  }
                  return <div className={`${focused ? 'focused' : ''}`}>{suggestion.display}</div>;
                }}
              />
            </MentionsInput>
            {endAdornment && <div style={{ position: 'absolute', right: 22, bottom: 16 }}>{endAdornment}</div>}
            {error && <p style={{ color: 'red', position: 'absolute', bottom: -20 }}>{error.message}</p>}
          </Box>
        );
      }}
    />
  );
}

export default MultilineMentionInput;

// Multiline Mention Input Styles
const mentionInputStyle = {
  wrapperStyles: {
    position: 'relative',
  },
  highlightedInput: {
    color: '#398357',
    zIndex: 1,
    position: 'relative',
    top: 1,
    left: 1,
  } as MentionsInputStyle,
  mentionsInput: {
    padding: '16px 24px 36px 24px',
    control: {
      fontSize: 14,
      fontFamily: 'SansDefaultMed',
      minHeight: 200,
    },
    highlighter: {
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
      border: 0,
      lineHeight: 1.5,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      outline: 'none',
      fontFamily: 'SansDefaultMed',
      padding: '16px 24px 36px 24px',
      lineHeight: 1.5,
    },
    suggestions: {
      list: {
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: '5px',
        backgroundColor: theme.palette.common.white,
        overflow: 'auto',
        maxHeight: 275,
        position: 'absolute',
        minWidth: 300,
        top: 25,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        backgroundColor: theme.palette.common.white,
        transition: 'background-color 0.2s ease-in-out',
        '&focused': {
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.common.white,
        },
      },
    } as MentionsInputStyle,
  },
};
