// file: /components/LinkButton.tsx
import React, { MouseEventHandler } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ButtonProps } from 'react-bootstrap/Button';

interface LinkButtonProps extends ButtonProps {
  to: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, onClick, ...rest }) => {
  const navigate = useNavigate();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
    navigate(to);
  };

  return (
    <Button
      {...rest}
      onClick={handleClick}
    />
  );
};

export default LinkButton;
