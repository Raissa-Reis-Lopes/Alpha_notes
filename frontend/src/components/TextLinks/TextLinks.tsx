import React from 'react';
import { Link } from 'react-router-dom';
import './TextLinks.css';

interface TextLinkProps {
  text: string;
  linkText: string; 
  linkTo: string;
  textColor?: string;
  linkColor?: string;
}

const TextLink: React.FC<TextLinkProps> = ({ text, linkText, linkTo, textColor = 'inherit', linkColor = 'inherit' }) => {
  return (
    <p style={{ color: textColor }}>
      {text}{' '}
      <Link to={linkTo} className="text-link" style={{ color: linkColor }}>
        {linkText}
      </Link>
    </p>
  );
};

export default TextLink;
