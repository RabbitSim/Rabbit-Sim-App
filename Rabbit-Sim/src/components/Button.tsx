import './component_styles/button.css';

interface ButtonProps {
  onClick?: () => void;
  label?: string;
}

function Button({ onClick, label }: ButtonProps) {
  return (
    <button onClick={onClick} className='button'>
      {label}
    </button>
  );
}

export default Button;