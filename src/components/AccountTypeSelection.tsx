/**
 * Komponent wyboru typu konta - analogiczny do wyboru typu płatności
 * Pozwala użytkownikowi wybrać między kontem parafianina a kontem parafii
 */

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ChurchIcon from '@mui/icons-material/Church';
import { 
  ACCOUNT_TYPES, 
  ACCOUNT_TYPE_LABELS, 
  ACCOUNT_TYPE_DESCRIPTIONS, 
  AccountType 
} from '@/constants/accountTypes';

interface AccountTypeSelectionProps {
  selectedType: AccountType | null;
  onTypeChange: (type: AccountType) => void;
}

export default function AccountTypeSelection({ 
  selectedType, 
  onTypeChange 
}: AccountTypeSelectionProps) {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTypeChange(event.target.value as AccountType);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Wybierz typ konta
      </Typography>
      
      <RadioGroup value={selectedType || ''} onChange={handleChange}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          {/* Konto parafianina */}
          <Card 
            sx={{ 
              flex: 1,
              cursor: 'pointer',
              border: selectedType === ACCOUNT_TYPES.PARISHIONER ? '2px solid #4caf50' : '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': { 
                borderColor: selectedType === ACCOUNT_TYPES.PARISHIONER ? '#4caf50' : '#ddd',
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => onTypeChange(ACCOUNT_TYPES.PARISHIONER)}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <FormControlLabel
                value={ACCOUNT_TYPES.PARISHIONER}
                control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                label=""
                sx={{ m: 0, mb: 2 }}
              />
              <PersonIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.PARISHIONER]}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ACCOUNT_TYPE_DESCRIPTIONS[ACCOUNT_TYPES.PARISHIONER]}
              </Typography>
            </CardContent>
          </Card>

          {/* Konto parafii */}
          <Card 
            sx={{ 
              flex: 1,
              cursor: 'pointer',
              border: selectedType === ACCOUNT_TYPES.PARISH_ADMIN ? '2px solid #4caf50' : '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': { 
                borderColor: selectedType === ACCOUNT_TYPES.PARISH_ADMIN ? '#4caf50' : '#ddd',
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => onTypeChange(ACCOUNT_TYPES.PARISH_ADMIN)}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <FormControlLabel
                value={ACCOUNT_TYPES.PARISH_ADMIN}
                control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                label=""
                sx={{ m: 0, mb: 2 }}
              />
              <ChurchIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.PARISH_ADMIN]}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ACCOUNT_TYPE_DESCRIPTIONS[ACCOUNT_TYPES.PARISH_ADMIN]}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </RadioGroup>
    </Box>
  );
}
