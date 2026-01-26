import InsertEmail from "../components/login-recovery/InsertEmail";
import ConfirmCode from "../components/login-recovery/ConfirmCode";
import { useState } from "react";
import NewPassword from "../components/login-recovery/NewPassword";

function LoginRecovery() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep(1);
  };

  const handleCodeSubmit = (submittedCode: string) => {
    // OTP verified, proceed to password step
    setStep(2);
  };

  return (
    <section>
      {step === 0 ? (
        <InsertEmail onSubmit={handleEmailSubmit} />
      ) : step === 1 ? (
        <ConfirmCode
          email={email}
          onSubmit={handleCodeSubmit}
          onBack={() => setStep(0)}
        />
      ) : (
        <NewPassword email={email} onBack={() => setStep(1)} />
      )}
    </section>
  );
}

export default LoginRecovery;
