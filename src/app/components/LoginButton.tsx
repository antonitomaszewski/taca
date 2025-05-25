"use client";
import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Link as MuiLink } from "@mui/material";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        sx={{ 
          fontWeight: 600, 
          bgcolor: '#4caf50', 
          color: 'white', 
          borderRadius: 2, 
          px: 3, 
          boxShadow: 1, 
          '&:hover': { bgcolor: '#45a049' },
          textTransform: 'none'
        }}
        onClick={handleOpen}
      >
        Zaloguj się
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box sx={{ p: 4 }}>
          <DialogTitle sx={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: '#1c1e21', mb: 2, p: 0 }}>
            Zaloguj się do Taca.pl
          </DialogTitle>
          <Box sx={{ textAlign: 'center', mb: 3, color: '#606770', fontSize: '1rem' }}>
            Szybko i bezpiecznie
          </Box>
          <DialogContent sx={{ p: 0 }}>
            <TextField
              autoFocus
              margin="dense"
              placeholder="Adres e-mail"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  bgcolor: '#f5f6f7',
                  border: '1px solid #dddfe2',
                  borderRadius: '6px',
                  '&:hover': {
                    bgcolor: '#ffffff'
                  },
                  '&.Mui-focused': {
                    bgcolor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#4caf50'
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '14px 16px'
                }
              }}
            />
            <TextField
              margin="dense"
              placeholder="Hasło"
              type="password"
              fullWidth
              variant="outlined"
              value={haslo}
              onChange={e => setHaslo(e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  bgcolor: '#f5f6f7',
                  border: '1px solid #dddfe2',
                  borderRadius: '6px',
                  '&:hover': {
                    bgcolor: '#ffffff'
                  },
                  '&.Mui-focused': {
                    bgcolor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#4caf50'
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '14px 16px'
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ flexDirection: 'column', gap: 2, alignItems: 'stretch', p: 0 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleClose}
              sx={{ 
                bgcolor: '#4caf50',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                py: 1.5,
                borderRadius: '6px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#45a049',
                  boxShadow: 'none'
                }
              }}
            >
              Zaloguj się
            </Button>
            <Box sx={{ textAlign: 'center', my: 1 }}>
              <MuiLink 
                href="/reset-hasla" 
                sx={{ 
                  color: '#4caf50', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Nie pamiętasz hasła?
              </MuiLink>
            </Box>
            <Box sx={{ borderTop: '1px solid #dadde1', pt: 3, textAlign: 'center' }}>
              <Button 
                variant="contained"
                href="/rejestracja"
                sx={{ 
                  bgcolor: '#42b883',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  borderRadius: '6px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: '#369870',
                    boxShadow: 'none'
                  }
                }}
              >
                Utwórz nowe konto
              </Button>
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
