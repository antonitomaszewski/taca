"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Link as MuiLink, Alert, CircularProgress, Menu, MenuItem } from "@mui/material";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEmail('');
    setHaslo('');
    setError('');
    setLoading(false);
    // Usuwamy focus z przycisku po zamknięciu dialogu
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
  };

  const handleLogin = async () => {
    if (!email || !haslo) {
      setError('Proszę wypełnić wszystkie pola');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password: haslo,
        redirect: false,
      });

      if (result?.error) {
        setError('Nieprawidłowy email lub hasło');
      } else if (result?.ok) {
        handleClose();
        // Pozostań na stronie głównej - nie przekierowuj
        window.location.reload(); // Odśwież stronę, aby zaktualizować stan
      }
    } catch (error) {
      setError('Wystąpił błąd podczas logowania');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut({ redirect: false });
    window.location.reload(); // Odśwież stronę po wylogowaniu
  };

  const handleGoToPanel = () => {
    handleMenuClose();
    router.push('/edycja-parafii');
  };

  // Jeśli użytkownik jest już zalogowany, pokaż menu z opcjami
  if (status === "authenticated") {
    const userName = session?.user?.name || session?.user?.email || 'Użytkownik';
    
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
          onClick={handleMenuClick}
          aria-controls={menuOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
        >
          {userName} ▼
        </Button>
        
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'account-button',
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleGoToPanel}>Panel parafii</MenuItem>
          <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
        </Menu>
      </>
    );
  }

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
              onKeyPress={handleKeyPress}
              disabled={loading}
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
              onKeyPress={handleKeyPress}
              disabled={loading}
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
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleLogin}
              disabled={loading}
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
                },
                '&:disabled': {
                  bgcolor: '#cccccc'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Zaloguj się'}
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
                href="/rejestracja-parafii"
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
