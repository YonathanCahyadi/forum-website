import { MouseEvent } from "react";

interface ButtonProps {
  name: string;
  onClick?: (event) => void;
}

const Button: React.FC<ButtonProps> = ({ name, onClick }) => {
  return (
    <button className="button-custom" onClick={onClick}>
      {name}
    </button>
  );
};

export default Button;
