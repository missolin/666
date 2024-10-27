import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useWebsiteStore } from '../store/websiteStore';
import { Website } from '../types';

export const WebsiteManager: React.FC = () => {
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(1);
  const { addWebsite } = useWebsiteStore();

  const handleAddWebsites = () => {
    if (url) {
      const processedUrl = url.startsWith('http') ? url : `https://${url}`;
      for (let i = 0; i < count; i++) {
        const website: Website = {
          id: `${Date.now()}-${i}`,
          url: processedUrl,
          title: `Website ${i + 1}`
        };
        addWebsite(website);
      }
      setUrl('');
    }
  };

  return (
    <Box p={2} display="flex" gap={2} alignItems="center">
      <TextField
        label="网站地址"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        size="small"
        fullWidth
        placeholder="example.com"
      />
      <TextField
        label="数量"
        type="number"
        value={count}
        onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
        size="small"
        style={{ width: '100px' }}
        inputProps={{ min: 1 }}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddWebsites}
      >
        添加
      </Button>
    </Box>
  );
};