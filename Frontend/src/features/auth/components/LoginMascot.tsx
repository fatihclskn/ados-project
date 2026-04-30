type LoginMascotProps = {
  focusedField: 'email' | 'password' | null;
  mousePosition: {
    x: number;
    y: number;
  };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function LoginMascot({ focusedField, mousePosition }: LoginMascotProps) {
  const isPasswordFocused = focusedField === 'password';
  const eyeX = clamp(mousePosition.x * 5, -5, 5);
  const eyeY = focusedField === 'email'
    ? clamp(mousePosition.y * 3 + 3, -1, 6)
    : clamp(mousePosition.y * 4, -4, 4);

  return (
    <div
      className={`login-mascot ${isPasswordFocused ? 'login-mascot--shy' : ''}`}
      aria-hidden="true"
    >
      <div className="login-mascot__antenna" />
      <div className="login-mascot__face">
        <div className="login-mascot__ear login-mascot__ear--left" />
        <div className="login-mascot__ear login-mascot__ear--right" />
        <div className="login-mascot__eyes">
          <span className="login-mascot__eye">
            <span
              className="login-mascot__pupil"
              style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
            />
          </span>
          <span className="login-mascot__eye">
            <span
              className="login-mascot__pupil"
              style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
            />
          </span>
        </div>
        <div className="login-mascot__closed-eyes">
          <span />
          <span />
        </div>
        <div className="login-mascot__smile" />
        <div className="login-mascot__hands">
          <span className="login-mascot__hand login-mascot__hand--left" />
          <span className="login-mascot__hand login-mascot__hand--right" />
        </div>
      </div>
    </div>
  );
}
