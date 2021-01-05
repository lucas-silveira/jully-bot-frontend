import { useCallback, useState } from 'react';
import {
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import * as FormStyle from '@styles/components/form.style';
import * as S from './styles';

type Step = {
  title: string;
  content: React.ReactNode;
};

type StepsProps = {
  steps: Step[];
};

export default function Steps({ steps }: StepsProps): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);

  const getStepContent = useCallback(
    (stepIndex: number) => {
      return steps[stepIndex].content;
    },
    [steps],
  );

  const handleNext = useCallback(() => {
    const next = activeStep + 1;

    if (next === steps.length) return;

    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }, [activeStep, steps]);

  const handleBack = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, []);

  return (
    <S.Wrapper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(step => (
          <Step key={step.title}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <S.Content>
        {activeStep === steps.length ? (
          <div>
            <Typography>Todas as etapas foram concluídas</Typography>
            <Button onClick={handleReset}>Reiniciar</Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <S.Footer>
              <FormStyle.Button
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Voltar
              </FormStyle.Button>
              <FormStyle.Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Criar conta' : 'Avançar'}
              </FormStyle.Button>
            </S.Footer>
          </div>
        )}
      </S.Content>
    </S.Wrapper>
  );
}
