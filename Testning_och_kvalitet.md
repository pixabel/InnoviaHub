# Testning och kvalitet

## Enhetstester i projektet

Projektet **InnoviaHub** består av flera komponenter med huvudsakligen C#, TypeScript och CSS. För backend-delen (C#) har vi skrivit enhetstester för att säkerställa funktionalitet och kvalitet, särskilt kring bokningssystemet.

### Viktiga tester

- **IsBookingAddedTest.cs**  
  Verifierar att bokningar faktiskt läggs till i systemet. Detta är grundläggande för att användare ska kunna lita på att deras bokningar sparas korrekt.

- **IsBookingAvailableTest.cs**  
  Kontrollerar om en resurs är ledig under en given tid. Testen minskar risken för dubbelbokningar och är central för att hålla bokningssystemet pålitligt.

- **IsBookingDeletedTest.cs**  
  Säkerställer att borttagning av bokningar fungerar och att data verkligen tas bort från systemet. Det är viktigt både för användarnas kontroll och för att undvika fel i resursplaneringen.

- **IsBookingOverlappingTest.cs**  
  Testar om nya bokningar överlappar med befintliga, vilket är avgörande för att undvika konflikter om resurser.

#### Varför dessa tester är viktiga

Dessa tester utgör grunden för ett robust och pålitligt bokningssystem. De:

- Skyddar mot dubbelbokningar och datakonflikter.
- Ger trygghet för utvecklare att vidareutveckla systemet utan att kompromissa på befintlig funktionalitet.
- Underlättar felsökning och snabba kodändringar, då man direkt ser om något bryter nuvarande logik.

## Reflektion över vidareutveckling och kvalitet

För att **InnoviaHub** ska vara lätt att vidareutveckla har projektet:

- Modulär arkitektur där backend-logik (C#) är separerad från frontend (TypeScript och CSS), vilket möjliggör oberoende utveckling och tester.
- Tydliga tjänster/klasser, till exempel `BookingService`, gör att nya funktioner kan läggas till eller ändras utan att påverka hela systemet.
- Enhetstester för både positiva och negativa scenarion, vilket gör att kodändringar snabbt kan verifieras.
- Kodstruktur och namngivning som är konsekvent och lätt att förstå för framtida utvecklare.
- Användning av modeller och parametrar istället för hårdkodade värden, vilket gör systemet flexibelt för förändringar (t.ex. nya resurs- eller bokningstyper).

## Säkerhet och hantering av hemliga nycklar

Säkerhet är prioriterat, särskilt kring hantering av hemliga nycklar och känsliga uppgifter. I produktion hanteras nycklar genom:

- **Miljövariabler** (`Environment Variables`) för API-nycklar, databasuppgifter och andra hemligheter.
- **Konfigurationsfiler** som `appsettings.json` används lokalt men checkas aldrig in i repo eller delad kodbas.
- Vid deployment används CI/CD-verktyg (exempelvis GitHub Actions med `secrets`) eller Azure Key Vault för säker och automatiserad hantering av nycklar.
- Ingen känslig information finns i källkoden eller versionshantering.

Detta skyddar både användare och system från potentiella säkerhetsrisker och följer bästa praxis.

---

**Sammanfattning:**  
Projektet är utformat för att vara testbart, vidareutvecklingsbart och säkert för produktion, med tydliga enhetstester, modulär kod och säker hantering av hemliga nycklar.
