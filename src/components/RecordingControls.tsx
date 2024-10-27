import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  FiberManualRecord as RecordIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { useWebsiteStore } from '../store/websiteStore';

export const RecordingControls: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const { isRecording, recordings, startRecording, stopRecording, playRecording } = useWebsiteStore();

  const handleStopRecording = () => {
    setDialogOpen(true);
  };

  const handleSaveRecording = () => {
    if (recordingName) {
      stopRecording(recordingName);
      setRecordingName('');
      setDialogOpen(false);
    }
  };

  return (
    <Box p={2} display="flex" gap={2} flexWrap="wrap">
      {!isRecording ? (
        <Button
          variant="contained"
          color="error"
          startIcon={<RecordIcon />}
          onClick={startRecording}
        >
          开始录制
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={handleStopRecording}
        >
          停止录制
        </Button>
      )}

      {recordings.map((recording) => (
        <Button
          key={recording.id}
          variant="outlined"
          startIcon={<PlayIcon />}
          onClick={() => playRecording(recording.id)}
        >
          播放: {recording.name}
        </Button>
      ))}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>保存录制</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="录制名称"
            fullWidth
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveRecording} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};