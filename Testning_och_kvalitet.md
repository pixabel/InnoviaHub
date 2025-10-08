# Testning och kvalitet

## Enhetstester i projektet

InnoviaHub består av flera komponenter, där backend är byggt i C# och omfattar även ett antal enhetstester för att säkerställa att kärnfunktionalitet helt enkelt fungerar som det ska, i synnerhet bokningssystemet.

### Tester

- **IsBookingAddedTest.cs**  
  Kontrollerar att bokningar läggs till korrekt i systemet. Detta är avgörande för att användare ska kunna lita på att deras bokningar sparas på ett korrekt sätt.

- **IsBookingAvailableTest.cs**  
  Testar om en resurs är ledig vid en viss tidpunkt. Detta förhindrar dubbelbokningar och säkerställer korrekt feedback till användarna.

- **IsBookingDeletedTest.cs**  
  Säkerställer att borttagna bokningar verkligen tas bort från systemet, vilket är viktigt både för datakvalitet och användarupplevelse.

- **IsBookingOverlappingTest.cs**  
  Kontrollerar att nya bokningar inte överlappar befintliga, vilket garanterar att systemet hanterar konflikter korrekt.

### Varför dessa tester är viktiga

Dessa tester är kärnan i ett pålitligt bokningssystem. De bidrar till:

- Att undvika dubbelbokningar och tidskonflikter.
- Att underlätta vidareutveckling utan att introducera buggar.
- Snabb felsökning vid kodändringar.

Om frontend-testning används (t.ex. med **Jest** eller **Vitest** i TypeScript) dokumenteras dessa också för att säkerställa kvalitet i användargränssnitt och integrationer.

## Reflektion över vidareutveckling

För att InnoviaHub ska kunna vidareutvecklas smidigt har projektet utformats med följande principer:

- **Modulär arkitektur** – backend-logik (C#) är separerad från frontend (TypeScript/CSS), vilket gör det enklare att lägga till nya funktioner.
- **Extensibla tjänster** – exempelvis `BookingService` och `OpenAIRecommendationService` är utformade för att kunna utökas utan stora förändringar i befintlig kod.
- **Testbar kod** – enhetstester för både positiva och negativa scenarier möjliggör snabb verifiering vid ändringar.
- **Tydlig kodstruktur** – konsekvent namngivning och organiserade mappar underlättar för nya utvecklare.
- **Parametriserad logik** – användning av datamodeller och parametrar istället för hårdkodade värden ökar flexibilitet och framtidssäkerhet.

## Säkerhet och hantering av hemliga nycklar

Säker hantering av nycklar och hemligheter är en central del av projektet:

- **Miljövariabler** – API-nycklar och andra känsliga uppgifter lagras i miljövariabler (t.ex. via `.env` under utveckling).
- **Git-säkerhet** – `.env` inkluderas alltid i `.gitignore` och checkas aldrig in i Git.
- **Produktion** – CI/CD-verktyg (t.ex. GitHub Actions, Azure Key Vault) används för att injicera hemligheter säkert.
- **Ingen hårdkodning** – inga hemligheter finns i källkod eller versionskontroll, vilket minimerar risk för läckage.

## Sammanfattning

InnoviaHub är designat för att vara testbart, säkert och enkelt att vidareutveckla.  
Enhetstester och modulär arkitektur säkerställer kvalitet, medan korrekt hantering av miljövariabler skyddar känslig information. Denna struktur gör det möjligt att snabbt lägga till nya funktioner och samtidigt behålla stabilitet och säkerhet.
