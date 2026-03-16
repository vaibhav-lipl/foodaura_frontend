import './Switch.css';

const Switch = ({ label, checked, onChange, disabled = false }) => {
  return (
    <div className={`switch-wrapper ${disabled ? 'disabled' : ''}`}>
      {label && <span className="switch-label">{label}</span>}

      <button
        type="button"
        className={`switch ${checked ? 'on' : 'off'}`}
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span className="switch-thumb" />
      </button>
    </div>
  );
};

export default Switch;
