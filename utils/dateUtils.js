// utils/dateUtils.js

export const formatDateRelative = (date) => {
  if (!date) return 'Unbekanntes Datum';
  
  // Prüfe, ob date ein String ist, und konvertiere ihn ggf. zu einem Date-Objekt
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Zeit zwischen jetzt und dem angegebenen Datum in Millisekunden
  const timeDiff = new Date().getTime() - dateObj.getTime();
  
  // Konvertiere in Minuten, Stunden und Tage
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  if (minutesDiff < 1) {
    return 'Gerade eben';
  } else if (minutesDiff < 60) {
    return `Vor ${minutesDiff} ${minutesDiff === 1 ? 'Minute' : 'Minuten'}`;
  } else if (hoursDiff < 24) {
    return `Vor ${hoursDiff} ${hoursDiff === 1 ? 'Stunde' : 'Stunden'}`;
  } else if (daysDiff < 7) {
    return `Vor ${daysDiff} ${daysDiff === 1 ? 'Tag' : 'Tagen'}`;
  } else {
    // Formatiere das Datum als DD.MM.YYYY
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  }
};