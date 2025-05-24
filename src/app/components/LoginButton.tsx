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
        color="inherit"
        sx={{ fontWeight: 600, bgcolor: 'white', color: 'primary.main', borderRadius: 2, px: 3, boxShadow: 1, ':hover': { bgcolor: '#f0f2f5' } }}
        onClick={handleOpen}
      >
        Zaloguj
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Zaloguj się</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="E-mail"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Hasło"
            type="password"
            fullWidth
            variant="outlined"
            value={haslo}
            onChange={e => setHaslo(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ width: '100%', textAlign: 'right', mb: 2 }}>
            <MuiLink href="/reset-hasla" color="primary" underline="hover" sx={{ fontSize: 14 }}>
              Nie pamiętasz hasła?
            </MuiLink>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, alignItems: 'stretch', px: 3, pb: 3 }}>
          <Button variant="contained" color="primary" fullWidth sx={{ mb: 1 }} onClick={handleClose}>
            Zaloguj
          </Button>
          <Button variant="outlined" color="primary" fullWidth href="/rejestracja">
            Utwórz konto
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
