// Simple mock for react-markdown
const React = require('react');

const ReactMarkdown = ({ children }) => {
  return <div data-testid="mock-markdown">{children}</div>;
};

module.exports = ReactMarkdown;
