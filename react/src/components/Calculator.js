import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Calculator.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#f57c00',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          borderRadius: 0,
          textTransform: 'none',
          padding: '20px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState('');
  const [operation, setOperation] = useState('');
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else if (value === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(display + value);
    }
    if (waitingForSecondValue) {
      setWaitingForSecondValue(false);
    }
  };

  const handleOperationClick = (op) => {
    setPrevValue(display);
    setOperation(op);
    setWaitingForSecondValue(true);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue('');
    setOperation('');
    setWaitingForSecondValue(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const calculateResult = () => {
    if (!prevValue || !operation) return;

    const num1 = parseFloat(prevValue);
    const num2 = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = num1 + num2;
    } else if (operation === '-') {
      result = num1 - num2;
    } else if (operation === '×') {
      result = num1 * num2;
    } else if (operation === '÷') {
      if (num2 === 0) {
        setDisplay('Error');
        setPrevValue('');
        setOperation('');
        setWaitingForSecondValue(false);
        return;
      }
      result = num1 / num2;
    }

    setDisplay(result.toString());
    setPrevValue('');
    setOperation('');
    setWaitingForSecondValue(false);
  };

  const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box className="calculator-container">
        <Paper elevation={3} className="calculator-display">
          <Typography variant="h3" align="right" className="display-text">
            {display}
          </Typography>
        </Paper>
        <Box className="calculator-buttons">
          <Grid container spacing={0} columns={4}>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleClear}
                className="button-special"
              >
                C
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleBackspace}
                className="button-special"
              >
                ⌫
              </Button>
            </Grid>
            {buttons.map((btn) => (
              <Grid item xs={1} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  color={['÷', '×', '-', '+'].includes(btn) ? 'secondary' : 'primary'}
                  onClick={() => {
                    if (['÷', '×', '-', '+'].includes(btn)) {
                      handleOperationClick(btn);
                    } else {
                      handleNumberClick(btn);
                    }
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={calculateResult}
                className="button-equals"
              >
                =
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Calculator;
