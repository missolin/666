import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { WebsiteManager } from './components/WebsiteManager';
import { RecordingControls } from './components/RecordingControls';
import { WebsiteFrame } from './components/WebsiteFrame';
import { useWebsiteStore } from './store/websiteStore';

const App: React.FC = () => {
  const { websites } = useWebsiteStore();
  const mainWebsite = websites[0];
  const otherWebsites = websites.slice(1);

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        <Typography variant="h5" gutterBottom>网站控制器</Typography>
        <WebsiteManager />
        <RecordingControls />
        
        {mainWebsite && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>主控窗口</Typography>
            <WebsiteFrame website={mainWebsite} isMainFrame={true} />
          </Box>
        )}

        {otherWebsites.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>从属窗口</Typography>
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2}>
              {otherWebsites.map((website) => (
                <WebsiteFrame key={website.id} website={website} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default App;