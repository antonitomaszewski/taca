// src/components/ParafiaView.tsx
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Paper, 
  Box, 
  LinearProgress, 
  Chip, 
  Card, 
  CardContent, 
  Avatar, 
  Container,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import Image from 'next/image';
import { formatBankAccount } from '@/lib/formatters';

export interface ParafiaData {
  id: string;
  nazwa: string;
  miejscowosc: string;
  adres: string;
  telefon?: string | null;
  email?: string | null;
  strona?: string | null;
  proboszcz?: string | null;
  rozkladMszy?: string | null;
  opis: string;
  photoUrl: string;
  kontoBank?: string | null;
  uniqueSlug?: string | null;
  zebrane: number;
  cel: number;
  wspierajacy: number;
  pozostalo?: number | null;
  cele: Array<{
    id: string;
    tytul: string;
    opis: string;
    kwotaCel: number;
    kwotaZebrana: number;
    aktywny: boolean;
  }>;
  ostatnieWsparcia: Array<{
    nazwa: string;
    kwota: number;
    czas: string;
  }>;
}

interface ParafiaViewProps {
  parafia: ParafiaData;
  showEditButton?: boolean;
}

export default function ParafiaView({ parafia, showEditButton = false }: ParafiaViewProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 2 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 600, 
                color: '#4caf50',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              component="a"
              href="/"
            >
              Taca.pl
            </Typography>
            {showEditButton && (
              <Button
                variant="outlined"
                sx={{
                  color: '#4caf50',
                  borderColor: '#4caf50',
                  mr: 2,
                  '&:hover': {
                    bgcolor: '#4caf50',
                    color: 'white',
                  },
                }}
                href={`/${parafia.uniqueSlug}/edycja`}
              >
                Edytuj parafię
              </Button>
            )}
            <Button
              variant="outlined"
              sx={{
                color: '#4caf50',
                borderColor: '#4caf50',
                '&:hover': {
                  bgcolor: '#4caf50',
                  color: 'white',
                },
              }}
              href="/mapa"
            >
              Znajdź parafię
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - now more compact */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
        <Box sx={{ 
          display: 'flex',
          gap: 4,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          {/* Parish Photo - smaller and square */}
          <Box sx={{
            position: 'relative',
            width: { xs: '100%', md: '300px' },
            height: '300px',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 3,
            flexShrink: 0
          }}>
            <Image
              src={parafia.photoUrl}
              alt={parafia.nazwa}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>

          {/* Parish Info */}
          <Paper sx={{ 
            flex: 1, 
            p: 4, 
            borderRadius: 3, 
            boxShadow: 3,
            bgcolor: 'white'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2e7d32' }}>
              {parafia.nazwa}
            </Typography>
            <Typography variant="h5" sx={{ color: '#666666', display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocationOnIcon sx={{ mr: 1, color: '#4caf50' }} />
              {parafia.miejscowosc}
            </Typography>
            
            {/* Contact Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: '#333333' }}>
                <LocationOnIcon sx={{ mr: 2, color: '#4caf50', fontSize: 20 }} />
                {parafia.adres || parafia.miejscowosc}
              </Typography>
              {parafia.telefon && (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: '#333333' }}>
                  <PhoneIcon sx={{ mr: 2, color: '#4caf50', fontSize: 20 }} />
                  {parafia.telefon}
                </Typography>
              )}
              {parafia.email && (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: '#333333' }}>
                  <EmailIcon sx={{ mr: 2, color: '#4caf50', fontSize: 20 }} />
                  {parafia.email}
                </Typography>
              )}
              {parafia.proboszcz && (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: '#333333' }}>
                  <PersonIcon sx={{ mr: 2, color: '#4caf50', fontSize: 20 }} />
                  {parafia.proboszcz}
                </Typography>
              )}
              {parafia.rozkladMszy && (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: '#333333' }}>
                  <AccessTimeIcon sx={{ mr: 2, color: '#4caf50', fontSize: 20 }} />
                  {parafia.rozkladMszy}
                </Typography>
              )}
              {parafia.kontoBank && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <AccountBalanceIcon sx={{ mr: 2, color: '#4caf50', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333333' }}>
                      Numer konta bankowego:
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', letterSpacing: 1, fontWeight: 500, color: '#333333' }}>
                      {formatBankAccount(parafia.kontoBank)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Support Button */}
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' },
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: 3,
              }}
              href={`/${parafia.uniqueSlug}/wsparcie`}
            >
              Wesprzyj parafię
            </Button>
          </Paper>
        </Box>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Description - Full Width */}
        <Paper sx={{ p: 4, mb: 6, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: '#2e7d32' }}>
            O parafii
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              lineHeight: 1.8, 
              color: '#333333',
              whiteSpace: 'pre-wrap' // Zachowuje znaki nowej linii i spacje
            }}
          >
            {parafia.opis}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          {/* Left Column - Goals */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            {/* Goals - only if there are active goals */}
            {parafia.cele.filter(cel => cel.aktywny).length > 0 && (
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, color: '#2e7d32' }}>
                  Aktywne zbiórki
                </Typography>
                {parafia.cele.filter(cel => cel.aktywny).map((cel) => {
                  const celPostep = cel.kwotaCel > 0 ? (cel.kwotaZebrana / cel.kwotaCel) * 100 : 0;
                  return (
                    <Box key={cel.id} sx={{ mb: 4, pb: 4, borderBottom: '1px solid #e0e0e0', '&:last-child': { border: 'none', mb: 0, pb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333' }}>
                          {cel.tytul}
                        </Typography>
                        <Chip
                          label="Aktywna"
                          color="success"
                          size="medium"
                        />
                      </Box>
                      <Typography variant="h6" sx={{ mb: 3, color: '#666666' }}>
                        {cel.opis}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#333333' }}>
                          {cel.kwotaZebrana.toLocaleString()} zł / {cel.kwotaCel.toLocaleString()} zł
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                          {celPostep.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(celPostep, 100)}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#4caf50',
                            borderRadius: 6,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Paper>
            )}
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ flex: { xs: 1, md: 1 }, maxWidth: { md: 400 } }}>
            {/* Mass Schedule */}
            {parafia.rozkladMszy && (
              <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2e7d32' }}>
                  Rozkład mszy świętych
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    color: '#333333'
                  }}
                >
                  {parafia.rozkladMszy}
                </Typography>
              </Paper>
            )}

            {/* Website */}
            {parafia.strona && (
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2e7d32' }}>
                  Strona internetowa
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon sx={{ mr: 2, color: '#4caf50', fontSize: 24 }} />
                  <Typography 
                    component="a"
                    href={parafia.strona.startsWith('http') ? parafia.strona : `https://${parafia.strona}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body1"
                    sx={{ 
                      color: '#4caf50',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {parafia.strona}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
