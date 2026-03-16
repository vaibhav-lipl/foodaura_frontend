import './Toggle.css';

const Toggle = ({ checked, onChange, disabled = false, label, size = 'md' }) => {
  return (
    <label className={`toggle-wrapper ${size} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="toggle-input"
      />
      <span className="toggle-slider"></span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
};

export default Toggle;

