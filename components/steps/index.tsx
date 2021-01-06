import { useCallback, useState } from 'react';
import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import * as FormStyle from '@styles/components/form.style';
import * as S from './styles';

type Step = {
  title: string;
  validator: (...args: any[]) => any;
  content: React.ReactNode;
};

type StepsProps = {
  steps: Step[];
  handleSubmit: (...args: any[]) => any;
};

export default function Steps({
  steps,
  handleSubmit,
}: StepsProps): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const getButtonText = useCallback(() => {
    return activeStep === steps.length - 1 ? 'Criar conta' : 'Avançar';
  }, [activeStep, steps]);

  const getStepContent = useCallback(
    (stepIndex: number) => {
      return steps[stepIndex].content;
    },
    [steps],
  );

  const handleNext = useCallback(async () => {
    const next = activeStep + 1;
    const formValidator = steps[activeStep].validator;
    const formIsValid = await formValidator();

    if (!formIsValid) return;

    if (next === steps.length) {
      setIsSending(true);
      await handleSubmit();
      setIsSending(false);
      return;
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }, [activeStep, steps, handleSubmit]);

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
                disabled={activeStep === 0 || isSending}
                onClick={handleBack}
              >
                Voltar
              </FormStyle.Button>
              <FormStyle.Button
                variant="contained"
                onClick={handleNext}
                isSending={isSending}
              >
                {isSending ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  getButtonText()
                )}
              </FormStyle.Button>
            </S.Footer>
          </div>
        )}
      </S.Content>
    </S.Wrapper>
  );
}
