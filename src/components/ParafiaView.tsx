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
  // Wyliczenia postępu i kwot
  const postep = (parafia.zebrane / parafia.cel) * 100;
  const pozostalaKwota = parafia.cel - parafia.zebrane;

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

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
        <Box sx={{ 
          position: 'relative', 
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 4,
          mb: 4
        }}>
          <Image
            src={parafia.photoUrl}
            alt={parafia.nazwa}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
              display: 'flex',
              alignItems: 'end',
              p: 4,
            }}
          >
            <Box>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {parafia.nazwa}
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                {parafia.miejscowosc}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          {/* Left Column - Main Info */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            {/* Progress Section */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                Postęp zbiórki
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Zebrano
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {postep.toFixed(1)}%
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={Math.min(postep, 100)}
                sx={{
                  height: 16,
                  borderRadius: 8,
                  mb: 3,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: postep >= 100 ? '#4caf50' : '#2196f3',
                    borderRadius: 8,
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 3, textAlign: 'center', mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                    {parafia.zebrane.toLocaleString()} zł
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    zebrano
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {parafia.cel.toLocaleString()} zł
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    cel
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {parafia.wspierajacy}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    wspierających
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#4caf50',
                    '&:hover': { bgcolor: '#45a049' },
                    py: 2,
                    px: 6,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    borderRadius: 3,
                  }}
                  href={`/${parafia.uniqueSlug}/wsparcie`}
                >
                  Wesprzyj parafię
                </Button>
                {parafia.pozostalo && parafia.pozostalo > 0 && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Pozostało {parafia.pozostalo} dni
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                O parafii
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  lineHeight: 1.8, 
                  color: 'text.secondary',
                  whiteSpace: 'pre-wrap' // Zachowuje znaki nowej linii i spacje
                }}
              >
                {parafia.opis}
              </Typography>
            </Paper>

            {/* Goals */}
            {parafia.cele.length > 0 && (
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
                  Cele zbiórki
                </Typography>
                {parafia.cele.map((cel) => {
                  const celPostep = cel.kwotaCel > 0 ? (cel.kwotaZebrana / cel.kwotaCel) * 100 : 0;
                  return (
                    <Box key={cel.id} sx={{ mb: 4, pb: 4, borderBottom: '1px solid #e0e0e0', '&:last-child': { border: 'none', mb: 0, pb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {cel.tytul}
                        </Typography>
                        <Chip
                          label={cel.aktywny ? 'Aktywny' : 'Zakończony'}
                          color={cel.aktywny ? 'success' : 'default'}
                          size="medium"
                        />
                      </Box>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                        {cel.opis}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                          {cel.kwotaZebrana.toLocaleString()} zł / {cel.kwotaCel.toLocaleString()} zł
                        </Typography>
                        <Typography variant="h6">
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
                            bgcolor: cel.aktywny ? '#4caf50' : '#9e9e9e',
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
            {/* Contact Info */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Kontakt
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <LocationOnIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                  <ListItemText 
                    primary={parafia.adres || parafia.miejscowosc}
                    primaryTypographyProps={{ variant: 'h6' }}
                  />
                </ListItem>
                {parafia.telefon && (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <PhoneIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                    <ListItemText 
                      primary={parafia.telefon}
                      primaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                )}
                {parafia.email && (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <EmailIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                    <ListItemText 
                      primary={parafia.email}
                      primaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                )}
                {parafia.strona && (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <LanguageIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                    <ListItemText 
                      primary={parafia.strona}
                      primaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                )}
                {parafia.proboszcz && (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <PersonIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                    <ListItemText 
                      primary={parafia.proboszcz}
                      primaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                )}
                {parafia.rozkladMszy && (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <AccessTimeIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                    <ListItemText 
                      primary={parafia.rozkladMszy}
                      primaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                )}
                {parafia.kontoBank && (
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <AccountBalanceIcon sx={{ mr: 3, color: 'text.secondary', fontSize: 28 }} />
                    <ListItemText 
                      primary="Konto bankowe"
                      secondary={parafia.kontoBank}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 600 }}
                      secondaryTypographyProps={{ variant: 'h6', fontFamily: 'monospace', letterSpacing: 1 }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            {/* Recent Donations */}
            {parafia.ostatnieWsparcia.length > 0 && (
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Ostatnie wpłaty
                </Typography>
                <List sx={{ p: 0 }}>
                  {parafia.ostatnieWsparcia.map((wsparcie, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 2 }}>
                      <Avatar sx={{ mr: 3, width: 40, height: 40, bgcolor: '#e3f2fd' }}>
                        {wsparcie.nazwa.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={wsparcie.nazwa}
                        secondary={`${wsparcie.kwota} zł • ${wsparcie.czas}`}
                        primaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
