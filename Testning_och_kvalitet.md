# Testning och kvalitet

## Översikt

InnoviaHub är ett bokningssystem där användare kan boka diverse kontors resurser via webbapplikationen. Denna är byggd med .NET, C# och React/TypeScript för frontend. För att säkerställa att applikationen fungerar korrekt och för att minska risken för eventuella fel, har ett antal enhetstester implementerats.

### Enhetstester

Följande tester har implementerats med xUnit och testar logiken i `BookingService`, som helt enkelt är kärnan i systemets funktionalitet:

- **IsBookingAddedTest.cs**  
  Verifierar att en ny bokning läggs till korrekt i systemet. Detta är avgörande för användarens upplevelse och för att säkerställa att ingen bokning tappas bort vid kommunikation mellan frontend och backend.

- **IsBookingAvailableTest.cs**  
  Testar att metoden för att kontrollera tillgänglighet på resurser fungerar korrekt. Denna logik används för att förhindra bokningar där resursen redan är upptagen.

- **IsBookingDeletedTest.cs**  
  Säkerställer att bokningar kan tas bort och att de inte längre existerar i det interna minnet eller databasen efter att de har blivit "avbokade". Viktigt både för användare men även för resurshanteringen.

- **IsBookingOverlappingTest.cs**  
  Förhindrar helt enkelt att det inte går att göra dubbelbokningar, vilket är avgörande för att undvika konflikter mellan användare som vill boka samma resurs.

### Betydelse för InnoviaHub

Dessa tester är viktiga för InnoviaHub för att kunna säkerställa ett fungerande, skalbar och användarsäker webbapplikation.
Testerna bidrar bland annat till att:

- Minskar risken för buggar genom att validera logik efter varje kodändring.
- Möjliggör refaktorering eftersom utvecklare kan se om befintlig funktionalitet bryts.
- Bidrar till snabb förståelse av applikationens funktionalitet, därav underlättar fortsatt arbete.
- Sparar tid vid testning, särskilt jämfört med manuell testning i frontend.

## Vidareutveckling och kodkvalitet

För att säkerställa att InnoviaHub är ett skalbart projekt även efter att det är färdigställt har vi försökt bygga det utefter en del principer.

### Modulär arkitektur

Systemet är uppdelat i separata, men tydliga lager:

- **Backend:** API, affärslogik, datamodeller
- **Frontend:** UI, användarinteraktion
- **Testprojekt:** enhetstester isolerat från resterande kod

Detta gör att varje del kan utvecklas och testas separat utan att påverka övriga delar, vilket minskar hut komplext det blir samt fel.

### Läsbarhet

- Namnsättning följer C#-syntax (PascalCase för metoder, camelCase för parametrar).
- Metoder som är tydliga och gör en sak (Single Responsibility Principle).
- Funktioner som kan återanvändas är placerade i separata klasser eller tjänster, t.ex. `BookingService`.

### Fokus på tester

Genom att först tänka igenom vad varje funktion ska klara av och sedan skriva tester för det, minimeras risken att oväntad logik smyger sig in. Det skapar ett mer stabilt fundament som enkelt kan byggas vidare på.

## Säkerhet: Hantering av hemliga nycklar

Säkerhet är en viktig del för alla applikationer. I just InnoviaHub har fokus legat på att hantera känsliga uppgifter och hemliga nycklar på ett både säkert men även hållbart sätt.

### Hantering av hemligheter

- För API-nyckeln och andra känsliga inställningar används miljövariabler, exempelvis för OpenAI API-nyckel och databaslösenord. Dessa ligger i en .env fil.
- `appsettings.Development.json` används lokalt för utvecklingsinställningar, men ingår inte på GitHub.
- Ingen hemlig information hårdkodas i koden, varken för API-anrop, databaser eller tokens.

### Varför detta är viktigt

- Skyddar både användardata och systemresurser.
- Utgör säker deployment utan att exponera känslig information för utvecklare, användare eller kodgranskare.

## Sammanfattning

InnoviaHub är alltså byggt med fokus på både kvalitet, testbarhet och säkerhet. Och genom användingen av enhetstester, tydlig kodstruktur och säker hantering av nycklar så fungerar projektet inte bara som det ska, utan är även redo för att evnetuellt byggas vidare.
