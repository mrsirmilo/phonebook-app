const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="phone-frame">
    <div className="screen">
      {children}
    </div>
  </div>
);

export default PhoneFrame;
