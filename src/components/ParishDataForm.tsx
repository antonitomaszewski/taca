/**
 * Komponent formularza danych parafii - drugi etap rejestracji dla proboszczów
 * Zawiera podstawowe dane parafii wyświetlane na profilu publicznym
 */

import React from 'react';
import { 
  Box, 
  TextField, 
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dynamic from 'next/dynamic';

// Dynamiczny import komponentu mapy z wyłączonym SSR
const EditMapComponent = dynamic(() => import('../app/edycja-parafii/EditMapComponent'), { 
  ssr: false,
  loading: () => (
    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Typography>Ładowanie mapy...</Typography>
    </Box>
  )
});

interface ParishDataFormProps {
  formData: {
    identyfikatorParafii: string;
    nazwaParafii: string;
    adresParafii: string;
    miastoParafii: string;
    kodPocztowyParafii: string;
    telefonParafii: string;
    emailParafii: string;
    stronkaParafii: string;
    opisParafii: string;
    proboszczParafii: string;
    godzinyMsz: string;
    numerKonta: string;
    zdjecieParafii: File | null;
    latitude?: number;
    longitude?: number;
  };
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  errors: Record<string, string>;
}

export default function ParishDataForm({ 
  formData, 
  onChange, 
  onFileChange,
  onLocationChange,
  errors 
}: ParishDataFormProps) {
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Dane Twojej parafii
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
        Te informacje będą wyświetlane na publicznym profilu parafii
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Podstawowe dane parafii */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Podstawowe informacje
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Identyfikator parafii"
                value={formData.identyfikatorParafii}
                onChange={onChange('identyfikatorParafii')}
                required
                fullWidth
                variant="outlined"
                error={!!errors.identyfikatorParafii}
                helperText={errors.identyfikatorParafii || 'Unikalny identyfikator URL np. "katedra-wroclaw". Tylko małe litery, cyfry i myślniki.'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <TextField
                label="Nazwa parafii"
                value={formData.nazwaParafii}
                onChange={onChange('nazwaParafii')}
                required
                fullWidth
                variant="outlined"
                error={!!errors.nazwaParafii}
                helperText={errors.nazwaParafii || 'np. "Parafia św. Jana Chrzciciela"'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <TextField
                label="Numer konta bankowego"
                value={formData.numerKonta}
                onChange={onChange('numerKonta')}
                required
                fullWidth
                variant="outlined"
                error={!!errors.numerKonta}
                helperText={errors.numerKonta || 'Numer konta do otrzymywania darowizn (format: 26 cyfr bez spacji)'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Zdjęcie parafii *
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#4caf50' },
                    ...(errors.zdjecieParafii && { borderColor: '#f44336' })
                  }}
                  onClick={() => document.getElementById('parish-photo-upload')?.click()}
                >
                  <input
                    id="parish-photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={onFileChange('zdjecieParafii')}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formData.zdjecieParafii 
                      ? `Wybrano: ${formData.zdjecieParafii.name}`
                      : 'Kliknij aby wybrać zdjęcie parafii'}
                  </Typography>
                  {errors.zdjecieParafii && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                      {errors.zdjecieParafii}
                    </Typography>
                  )}
                </Box>
              </Box>

              <TextField
                label="Imię i nazwisko proboszcza"
                value={formData.proboszczParafii}
                onChange={onChange('proboszczParafii')}
                fullWidth
                variant="outlined"
                error={!!errors.proboszczParafii}
                helperText={errors.proboszczParafii}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Adres parafii */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Adres parafii
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Adres"
                value={formData.adresParafii}
                onChange={onChange('adresParafii')}
                required
                fullWidth
                variant="outlined"
                error={!!errors.adresParafii}
                helperText={errors.adresParafii || 'np. "ul. Kościelna 12"'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Kod pocztowy"
                  value={formData.kodPocztowyParafii}
                  onChange={onChange('kodPocztowyParafii')}
                  variant="outlined"
                  error={!!errors.kodPocztowyParafii}
                  helperText={errors.kodPocztowyParafii}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                  }}
                />

                <TextField
                  label="Miasto"
                  value={formData.miastoParafii}
                  onChange={onChange('miastoParafii')}
                  required
                  variant="outlined"
                  error={!!errors.miastoParafii}
                  helperText={errors.miastoParafii}
                  sx={{
                    flex: 2,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                  }}
                />
              </Box>

              {/* Mapa lokalizacji */}
              {onLocationChange && (
                <Box sx={{ mt: 3 }}>
                  <EditMapComponent
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationChange={onLocationChange}
                    currentAddress={formData.adresParafii && formData.miastoParafii ? `${formData.adresParafii}, ${formData.miastoParafii}` : formData.miastoParafii}
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                    💡 Wskazówka: Wpisz adres w polach powyżej, a mapa automatycznie pokaże lokalizację. Możesz też kliknąć na mapie aby ustawić dokładną pozycję kościoła.
                  </Typography>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Kontakt */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Kontakt z parafią
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Telefon kontaktowy parafii"
                value={formData.telefonParafii}
                onChange={onChange('telefonParafii')}
                fullWidth
                variant="outlined"
                error={!!errors.telefonParafii}
                helperText={errors.telefonParafii || 'Numer, pod który mogą dzwonić parafianie'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <TextField
                label="Email kontaktowy parafii"
                type="email"
                value={formData.emailParafii}
                onChange={onChange('emailParafii')}
                fullWidth
                variant="outlined"
                error={!!errors.emailParafii}
                helperText={errors.emailParafii || 'Email publiczny parafii (może się różnić od Twojego)'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <TextField
                label="Strona internetowa"
                value={formData.stronkaParafii}
                onChange={onChange('stronkaParafii')}
                fullWidth
                variant="outlined"
                error={!!errors.stronkaParafii}
                helperText={errors.stronkaParafii}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Dodatkowe informacje */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Dodatkowe informacje
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Godziny mszy świętych"
                value={formData.godzinyMsz}
                onChange={onChange('godzinyMsz')}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!errors.godzinyMsz}
                helperText={errors.godzinyMsz || 'np. "Niedziela: 7:00, 9:00, 11:00, 18:00"'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />

              <TextField
                label="Opis parafii"
                value={formData.opisParafii}
                onChange={onChange('opisParafii')}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                error={!!errors.opisParafii}
                helperText={errors.opisParafii || 'Krótki opis historii i charakteru parafii'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
