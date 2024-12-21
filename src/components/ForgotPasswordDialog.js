import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Steps } from 'primereact/steps';

export default function ForgotPasswordDialog({
  visible,
  onHide,
  activeStep,
  setActiveStep,
  error,
  emailForReset,
  setEmailForReset,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
}) {
  const steps = [
    { label: 'Enter Email' },
    { label: 'Enter OTP' },
    { label: 'Enter New Password' },
  ];

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Forgot Password"
      footer={
        <Button
          label={activeStep === 2 ? 'Submit' : 'Next'}
          icon="pi pi-check"
          onClick={onSubmit}
          autoFocus
          className="w-full bg-[#d76d77] border-none outline-none focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
        />
      }
      style={{ width: '90vw', maxWidth: '500px' }}
    >
      <div className="p-fluid">
        <Steps model={steps} activeIndex={activeStep} className="mb-4 custom-steps" />
        {activeStep === 0 && (
          <div className="mb-4">
            <label htmlFor="emailForReset" className="block text-sm font-semibold text-[#6a5d5e]">Enter your email</label>
            <input
              type="email"
              id="emailForReset"
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
              placeholder="you@example.com"
            />
          </div>
        )}
        {activeStep === 1 && (
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-semibold text-[#6a5d5e]">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
              placeholder="Enter OTP"
            />
          </div>
        )}
        {activeStep === 2 && (
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-[#6a5d5e]">Enter New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
              placeholder="New password"
            />
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#6a5d5e] mt-4">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d76d77]"
              placeholder="Confirm new password"
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
