import './component_styles/button.css';

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

function Button({ onClick, label, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} className='button' disabled={disabled}>
      {label}
    </button>
  );
}

export default Button;  