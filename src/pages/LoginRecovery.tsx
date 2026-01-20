import InsertEmail from "../components/login-recovery/InsertEmail";
import ConfirmCode from "../components/login-recovery/ConfirmCode";
import { useState } from "react";
import NewPassword from "../components/login-recovery/NewPassword";

function LoginRecovery() {
  const [step, setStep] = useState(0);

  const handleEmailSubmit = () => {
    setStep(1);
  };

  const handleCodeSubmit = () => {
    setStep(2);
  };

  return (
    <section>
      {step === 0 ? (
        <InsertEmail onSubmit={handleEmailSubmit} />
      ) : step === 1 ? (
        <ConfirmCode onSubmit={handleCodeSubmit} />
      ) : (
        <NewPassword />
      )}
    </section>
  );
}

export default LoginRecovery;
