import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const LogoutConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirm Logout",
  message = "Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard."
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        className: "rounded-2xl shadow-2xl border-0",
        style: {
          minWidth: '400px',
          padding: '8px'
        }
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <DialogTitle 
        id="logout-dialog-title" 
        className="text-center pb-2"
        style={{ 
          color: '#033A3D',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          paddingTop: '24px'
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <WarningAmberIcon 
            style={{ 
              fontSize: '2.5rem', 
              color: '#f59e0b',
              marginRight: '8px'
            }} 
          />
        </div>
        {title}
      </DialogTitle>
      
      <DialogContent className="text-center px-6">
        <DialogContentText 
          id="logout-dialog-description"
          style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            lineHeight: '1.6'
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions className="justify-center gap-4 pb-6 px-6">
        <Button
          onClick={onClose}
          variant="outlined"
          className="px-8 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-base min-w-[120px]"
          style={{
            textTransform: 'none',
            borderColor: '#d1d5db',
            color: '#374151'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={<LogoutIcon />}
          className="px-8 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 font-semibold text-base min-w-[120px] shadow-lg hover:shadow-xl"
          style={{
            textTransform: 'none',
            backgroundColor: '#ef4444',
            boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.3)'
          }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmationDialog;