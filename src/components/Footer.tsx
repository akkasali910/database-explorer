import React from 'react';
import { Box, Link, SpaceBetween } from '@cloudscape-design/components';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="app-footer" style={{ borderTop: '1px solid var(--color-border-divider-default)' }}>
      <Box
        padding="m"
        color="text-body-secondary"
        fontSize="body-s"
        textAlign="center"
      >
        <SpaceBetween size="xs" direction="horizontal">
          <div>© {currentYear} Database Explorer</div>
          <Link href="#" variant="secondary">Privacy Policy</Link>
          <Link href="#" variant="secondary">Terms of Use</Link>
          <Link href="#" variant="secondary">Contact Us</Link>
        </SpaceBetween>
        <Box padding={{ top: 'xs' }} fontSize="body-s" color="text-body-secondary">
          Powered by AWS Cloudscape Design System
        </Box>
      </Box>
    </div>
  );
};

export default Footer;