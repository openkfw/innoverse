import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

import Box from '@mui/material/Box';

import { useMentions } from '@/app/contexts/mentions-context';
import { MultilineMentionInputProps } from '@/common/formTypes';
import { fetchMentionData } from '@/components/collaboration/comments/actions';
import * as m from '@/src/paraglide/messages.js';

type MentionCallbackType = (data: SuggestionDataItem[]) => void;

function MultilineMentionInput({
  control,
  name,
  placeholder,
  readOnly = false,
  endAdornment,
  rows = 4,
}: MultilineMentionInputProps) {
  const { mentions, setMentions } = useMentions();
  const loading = m.components_common_form_MultilineMentionInput_loading();

  function fetchAndFilterMentionData(search: string, callback: MentionCallbackType) {
    if (mentions === null) {
      callback([{ id: 'loading', display: loading }]);
      fetchMentionData(search).then((fetchedUsers) => {
        setMentions(fetchedUsers);
        callback(fetchedUsers);
      });
    } else {
      callback(mentions.filter((user) => user.display.toLowerCase().includes(search.toLowerCase())));
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
              style={mentionInputStyle.mentionsInput}
              placeholder={placeholder}
              spellCheck="false"
              readOnly={readOnly}
              rows={rows}
            >
              <Mention
                trigger="@"
                displayTransform={(_id: string, display: string) => `@${display}`}
                appendSpaceOnAdd={true}
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
  mentionsInput: {
    control: {
      backgroundColor: 'white',
      fontSize: 14,
      fontFamily: 'SansDefaultMed',
      minHeight: 200,
    },
    highlighter: {
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      outline: 'none',
      fontFamily: 'SansDefaultMed',
      padding: '16px 24px 36px 24px',
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        overflow: 'auto',
        maxHeight: 280,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#2677f0',
          color: 'white',
        },
      },
    },
  },
};
