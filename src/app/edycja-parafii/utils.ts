export const prepareParishData = (formData: any) => {
  return {
    ...formData,
    phoneNumber: formatPhoneForDatabase(formData.phoneNumber),
    bankAccount: formatBankAccount(formData.bankAccount)
  }
}

export const hasFormChanges = (original: ParishData, current: ParishData) => {
  // logika porównania
}

export const formatParishForDisplay = (parish: Parish) => {
  // formatowanie dla UI
}