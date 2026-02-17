import { Settings } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import shapData from 'data/shap_diabetes.json';
import { OPENAI_API_KEY } from 'lib/config';
import {
  getLocalStorageString,
  removeLocalStorageKey,
  setLocalStorageString,
} from 'lib/utility/localStorage';

import {
  freeTextAtom,
  insightAtom,
  isSubmittedAtom,
  isUserStudyAtom,
  pageNameAtom,
} from 'app/atoms';
import { generatePrompt, parseInput } from 'lib/llm/prompt';
import type { TInsight } from 'lib/types';
import { GenerateTextTemplates } from 'lib/utility/parseTemplate';

import 'app/styles/Interpretation.css';

export default function Interpretation() {
  const [isSubmitted, setIsSubmitted] = useAtom(isSubmittedAtom);
  const [freeText, setFreeText] = useAtom(freeTextAtom);
  const [insight, setInsight] = useAtom(insightAtom);
  const [pageName] = useAtom(pageNameAtom);
  const [isUserStudy, setIsUserStudy] = useAtom(isUserStudyAtom);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const envKey = (OPENAI_API_KEY ?? '').trim();

    if (isDev && envKey) {
      setApiKey(envKey);
      setModalVisible(false);
      return;
    }

    const storedApiKey = getLocalStorageString('apiKey') ?? '';

    if (pageName?.includes('Free') && !storedApiKey) {
      setModalVisible(true);
    }

    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [pageName]);

  const handleApiKeySubmit = () => {
    setLocalStorageString('apiKey', apiKey);
    setModalVisible(false);
  };

  const clearApiKey = () => {
    removeLocalStorageKey('apiKey');
    setApiKey('');
    setModalVisible(true);
  };

  useEffect(() => {
    setIsSubmitted(false);
    pageName?.includes('question')
      ? setIsUserStudy(true)
      : setIsUserStudy(false);
  }, [pageName, setIsSubmitted, setIsUserStudy]);

  const handleSubmission = async () => {
    if (!freeText.trim()) return;

    setIsLoading(true);

    if (insight === undefined) {
      const prompt = generatePrompt(shapData.feature_names);

      try {
        const parsedInput: TInsight = await parseInput(
          freeText,
          apiKey,
          prompt,
        );
        setInsight(parsedInput);
      } catch (error) {
        console.error('Error parsing input: ', error);
      }
    }

    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeText(e.target.value);
    setIsSubmitted(false);
  };

  return (
    <>
      <Paper style={{ padding: '15px' }}>
        <Box display="flex" alignItems="baseline">
          <Typography variant="h5" gutterBottom>
            Interpretation
          </Typography>

          {pageName?.includes('Free') && (
            <IconButton
              onClick={clearApiKey}
              aria-label="settings"
              sx={{
                color: '#aaaaaaa',
                border: '1px solid',
                borderRadius: '8px',
                padding: '4px',
                width: '24px',
                height: '24px',
                ml: 1,
              }}
            >
              <Settings sx={{ fontSize: 12 }} />
            </IconButton>
          )}
        </Box>

        {isUserStudy ? (
          <TextField
            id="outlined-basic"
            value={freeText}
            onChange={handleTextChange}
            multiline
            minRows={1}
            maxRows={10}
            fullWidth
            disabled={isUserStudy}
            sx={{
              '& .Mui-disabled': {
                WebkitTextFillColor: 'black !important',
              },
            }}
          />
        ) : (
          <TextField
            id="outlined-basic"
            label="e.g., a high bmi leads to large diabetes progression"
            value={freeText}
            onChange={handleTextChange}
            multiline
            minRows={1}
            maxRows={10}
            fullWidth
          />
        )}

        <div style={{ alignItems: 'center' }}>
          {/* Conditionally render the button if the user is NOT in the user study */}
          {!isUserStudy && (
            <Button
              variant="outlined"
              disabled={isSubmitted}
              color="primary"
              style={{ margin: '10px 5px' }}
              onClick={handleSubmission}
            >
              Check with Additional Visualization
            </Button>
          )}
        </div>

        {isLoading ? (
          <CircularProgress />
        ) : (
          isSubmitted &&
          !isUserStudy && (
            <Paper className="parse-input" elevation={0}>
              <b>Formatted: </b>
              {GenerateTextTemplates(insight)}
            </Paper>
          )
        )}
      </Paper>

      <Modal open={modalVisible} onClose={() => {}}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            id="api-key"
            label="Enter your OpenAI API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            rows={1}
            fullWidth
            style={{ marginTop: '15px' }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ margin: '10px 5px' }}
            onClick={handleApiKeySubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
