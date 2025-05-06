import React from 'react';
import { TopNavigation } from '@cloudscape-design/components';

const Header: React.FC = () => {
  return (
    <div className="app-header">
      <TopNavigation
        identity={{
          href: '#',
          title: 'Database Explorer',
          logo: {
            src: 'https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af40773cbfbd15577a3c2b8a346fe3e8fa2.png',
            alt: 'Powered by AWS'
          }
        }}
        utilities={[
          {
            type: 'button',
            text: 'Documentation',
            href: '#',
            external: true,
            externalIconAriaLabel: ' (opens in a new tab)'
          },
          {
            type: 'button',
            text: 'Help',
            href: '#',
          },
          {
            type: 'menu-dropdown',
            text: 'User',
            description: 'admin@example.com',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'security', text: 'Security' },
              { id: 'signout', text: 'Sign out' }
            ]
          }
        ]}
      />
    </div>
  );
};

export default Header;