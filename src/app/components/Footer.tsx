// Komponent Footer - stopka widoczna na każdej stronie
// Inspirowana designem siepomaga.pl ale w prostej wersji
'use client';

import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        mt: 'auto', // Przesuwa footer na dół strony
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Główna sekcja footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
            mb: 3,
          }}
        >
          {/* Logo i opis */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 400 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#2e7d32',
                mb: 1,
              }}
            >
              Taca.pl
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              Nowoczesna platforma do wsparcia parafii online. 
              Ułatwiamy przekazywanie datków i budowanie społeczności religijnej.
            </Typography>
          </Box>

          {/* Linki pomocne */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 2,
              }}
            >
              Przydatne linki
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="/mapa"
                color="inherit"
                underline="hover"
                sx={{ color: '#666', '&:hover': { color: '#2e7d32' } }}
              >
                Znajdź parafię
              </Link>
              <Link
                href="/rejestracja-parafii"
                color="inherit"
                underline="hover"
                sx={{ color: '#666', '&:hover': { color: '#2e7d32' } }}
              >
                Zarejestruj parafię
              </Link>
            </Box>
          </Box>

          {/* Kontakt */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 2,
              }}
            >
              Kontakt
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  kontakt@taca.pl
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  +48 000 000 000
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Dolna sekcja - prawa autorskie */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © {currentYear} Taca.pl. Wszystkie prawa zastrzeżone.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}
          >
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{
                color: '#666',
                fontSize: '0.875rem',
                '&:hover': { color: '#2e7d32' },
              }}
            >
              Regulamin
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{
                color: '#666',
                fontSize: '0.875rem',
                '&:hover': { color: '#2e7d32' },
              }}
            >
              Polityka prywatności
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{
                color: '#666',
                fontSize: '0.875rem',
                '&:hover': { color: '#2e7d32' },
              }}
            >
              Pomoc
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
