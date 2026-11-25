/* German copy is keyed by visible English messages or stable story IDs. */
const GERMAN=(()=>{
 const translations=Object.create(null);
 function pairs(lines){
  for(const line of lines.trim().split('\n')){
   const bar=line.indexOf('|');
   if(bar>0)translations[line.slice(0,bar)]=line.slice(bar+1);
  }
 }
 pairs(`
Home|Startseite
Architecture|Architektur
Reset|Zurücksetzen
Reset progress?|Spielfortschritt zurücksetzen?
This clears saved progress for Alex, Nova and the optional scenarios on this device.|Dadurch wird der gespeicherte Fortschritt von Alex, Nova und den Extraszenarien auf diesem Gerät gelöscht.
Cancel|Abbrechen
Reset progress|Fortschritt löschen
Main navigation|Hauptnavigation
The Agent House|Das Agentenhaus
Trust Boundaries|Trust Boundaries
Stage 0|Stufe 0
Stage 1|Stufe 1
Stage 2|Stufe 2
Stage 3|Stufe 3
Unknown|Unbekannt
Build|Aufbauen
Authorize|Freigeben
Resist|Abwehren
UNKNOWN|UNBEKANNT
BUILD|AUFBAUEN
AUTHORIZE|FREIGEBEN
RESIST|ABWEHREN
Two stories about who gets permission to do a job, what can go wrong, and how to make sure access ends when the job is done.|Zwei Geschichten darüber, wer bei einer Aufgabe was darf, was dabei schiefgehen kann und wie man prüft, ob der Zugriff nach getaner Arbeit wirklich endet.
NEW TO AI OR SECURITY? START HERE|NEU BEI KI ODER IT-SICHERHEIT? HIER STARTEN
FOR PLAYERS FAMILIAR WITH AI OR IT SECURITY|FÜR ALLE MIT KI- ODER IT-SICHERHEITSKENNTNISSEN
Alex|Alex
Nova|Nova
At home|Zu Hause
At a railway company|Bei einem Bahnunternehmen
Play a teenager with a hidden phone, a school project and a family laptop. See who can say yes to an app or a file, and what happens when someone asks for more.|Du spielst einen Teenager mit einem heimlichen Handy, einem Schulprojekt und einem Familienlaptop. Finde heraus, wer eine App oder Datei freigeben darf und was passiert, wenn jemand mehr verlangt.
Play an AI agent, software that uses tools to do a job. Investigate a railway disruption and see how an organization controls access to its systems, data and tools.|Du spielst einen KI-Agenten, also ein Programm, das Werkzeuge für eine Aufgabe nutzt. Untersuche eine Bahnstörung und erfahre, wie das Unternehmen den Zugriff auf Systeme, Daten und Werkzeuge steuert.
Start with Alex|Mit Alex anfangen
Start with Nova|Mit Nova anfangen
Continue Alex’s story|Alex’ Geschichte fortsetzen
Continue Nova’s story|Novas Geschichte fortsetzen
Four stages of AI security|Vier Stufen der KI-Sicherheit
Both stories follow the same stages. Start at Unknown for the full story, or choose a stage below.|Beide Geschichten durchlaufen dieselben Stufen. Starte bei „Unbekannt“, um alles zu erleben, oder wähle unten eine Stufe.
See the recommended action in each scene.|In jeder Szene siehst du, was du als Nächstes tun kannst.
Explore with the mission in view and ask for the next step whenever you need it.|Erkunde die Umgebung. Deine Aufgabe bleibt sichtbar, und du kannst jederzeit nach dem nächsten Schritt fragen.
Discover unmanaged activity and contain what it reached.|Entdecke, was unbemerkt passiert ist, und sichere die betroffenen Zugänge.
Verify who is acting and give them a controlled place to work.|Prüfe, wer die Aufgabe übernimmt, und richte einen sicheren Arbeitsplatz ein.
Grant access for a specific task and check that it ends with the work.|Erlaube genau den Zugriff, den die Aufgabe braucht, und prüfe, ob er danach endet.
Limit delegated actions and verify containment when something goes wrong.|Begrenze, was andere übernehmen dürfen, und prüfe bei Problemen, ob alle betroffenen Zugänge gesperrt sind.
Find out what happens when a hidden phone and an open bank session go unnoticed.|Erlebe, was passiert, wenn ein heimliches Handy und ein geöffnetes Bankkonto unbemerkt bleiben.
Research the solar system with a school assignment and a managed phone.|Erforsche das Sonnensystem für die Schule. Auf dem Handy sind nur erlaubte Apps verfügbar.
Find a better source and get read-only access to one folder.|Finde eine bessere Quelle und lass dir genau einen Ordner zum Lesen freigeben.
Work with Jo and Mia, then see which controls respond when someone crosses a boundary.|Arbeite mit Jo und Mia zusammen und finde heraus, was passiert, wenn jemand die Regeln umgeht.
Play {{1}}|{{1}} spielen
Review {{1}}|{{1}} noch einmal ansehen
Continue Alex|Bei Alex weiterspielen
Continue Nova|Bei Nova weiterspielen
Progress is saved on this device.|Dein Fortschritt wird auf diesem Gerät gespeichert.
Progress is kept for this visit.|Dein Fortschritt bleibt für diesen Besuch erhalten.
Play mode|Spielmodus
Guided|Mit Anleitung
Exploration|Erkunden
Mission checklist|Aufgabenliste
Mission milestones|Fortschritt bei den Teilzielen
Current milestone|Nächstes Teilziel
Done|Erledigt
Current|Jetzt
Ahead|Danach
Offer hints when idle in Exploration|Beim Erkunden nach einer Weile Hinweise anzeigen
Show next step|Nächsten Schritt zeigen
Find the highlighted action|Markierte Aktion anzeigen
Go to Outside the house|Vor das Haus gehen
Go to Alex’s room|In Alex’ Zimmer gehen
Go to Living room|Ins Wohnzimmer gehen
Go to Kitchen|In die Küche gehen
Go to {{1}}. {{2}}.|Wechsle zu „{{1}}“. {{2}}.
Go to {{1}}|Zu „{{1}}“ wechseln
Look for {{1}} in {{2}}.|Halte in „{{2}}“ nach „{{1}}“ Ausschau.
Open {{1}}. {{2}}.|Öffne „{{1}}“. {{2}}.
Return to the room. {{1}}.|Geh zurück ins Zimmer. {{1}}.
Open {{1}}|{{1}} öffnen
Return to the room|Zurück ins Zimmer
Back to the room|Zurück ins Zimmer
{{1}} of {{2}}|{{1}} von {{2}}
Device location|Wo sich das Gerät befindet
Rooms|Räume
{{1}} objects and people|{{1}}: Gegenstände und Personen
Optional security scenarios|Extras zum Ausprobieren
Optional security tests|Optionale Sicherheitstests
OPTIONAL SCENARIO|EXTRASZENARIO
Resume or restart|Fortsetzen oder neu starten
The assignment is on hold while you try this scenario.|Deine eigentliche Aufgabe wartet, während du dieses Szenario ausprobierst.
Return to the assignment to pick up the main story.|Kehre zur Aufgabe zurück, um die Geschichte fortzusetzen.
Return to the assignment|Zurück zur Aufgabe
Restart this scenario|Szenario neu starten
Decision evidence|Was die Entscheidung belegt
Stage debrief|Rückblick auf die Stufe
Stage complete|Stufe abgeschlossen
Review the evidence|Ergebnisse ansehen
What changed|Was sich geändert hat
Resources used|Verwendete Quellen und Werkzeuge
Controls you explored|Ausprobierte Regeln
Remaining risk|Was offenbleibt
Next stage|Nächste Stufe
How this applies at work|Was das mit KI bei der Arbeit zu tun hat
Replay the architecture sequence|Den technischen Ablauf ansehen
Explore this stage’s architecture|Die Architektur dieser Stufe ansehen
Compare with Nova at this stage|Dieselbe Stufe mit Nova ansehen
Compare with Alex at this stage|Dieselbe Stufe mit Alex ansehen
Continue to Stage {{1}}|Weiter zu Stufe {{1}}
Replay Stage {{1}}|Stufe {{1}} erneut spielen
Replay this stage|Diese Stufe erneut spielen
Continue to the next stage|Weiter zur nächsten Stufe
← Return to {{1}}|← Zurück zu {{1}}
Enterprise Architecture Guide|Leitfaden zur Unternehmensarchitektur
Outside the house|Vor dem Haus
Alex’s room|Alex’ Zimmer
Living room|Wohnzimmer
Kitchen|Küche
Grandparents|Großeltern
Parents|Eltern
Ms Patel|Frau Patel
Parents · remote|Eltern am Telefon
Parents · remote call|Anruf bei den Eltern
babysitter|Babysitter
Assignment card|Aufgabenkarte
Tom’s new assignment|Toms neue Aufgabe
Assignment board|Aufgabenbrett
Phone|Handy
Games|Spiele
Messaging|Nachrichten
Homework timer|Hausaufgaben-Timer
Family laptop|Familienlaptop
Workbook|Arbeitsheft
Notepad|Notizblock
Locked cabinet|Abgeschlossener Schrank
Replacement phone|Ersatzhandy
School delivery channel|Schul-App zum Abgeben
Archive|Ablage
School contact card|Kontaktdaten der Schule
House rules|Hausregeln
Mia’s assignment board|Mias Aufgabenbrett
Mia’s phone|Mias Handy
Alex’s phone|Alex’ Handy
Jo’s phone|Jos Handy
Conductor notes folder|Ordner mit Papas Zugbegleiter-Notizen
Family finances folder|Ordner mit den Familienfinanzen
Read-only file|Datei nur zum Lesen
ChatGPT homework channel|Hausaufgaben-App mit ChatGPT
Retired session|Alter, gesperrter Zugang
Incident log|Protokoll der Vorfälle
Home Wi-Fi router|WLAN-Router zu Hause
Hallway camera feed|Bild der Flurkamera
Suspicious source note|Verdächtiger Hinweis auf einer Seite
Phone time limit|Handy-Zeitlimit
Old phone PIN|Alte Handy-PIN
Old laptop password|Altes Laptop-Passwort
Alex’s managed phone|Alex’ Handy mit Kindersicherung
Other websites|Andere Websites
Private attachment|Privater Anhang
Workbook delivery|Arbeitsheft abgeben
Mia’s draft access|Mias Zugang zum Entwurf
Mia’s task permissions|Was Mia für ihre Aufgabe darf
Phone controls|Handy-Einstellungen
Homework channel|Hausaufgaben-App
Workbook permissions|Zugriff auf das Arbeitsheft
Apps|Apps
Browser|Browser
Controls|Einstellungen
Session|Anmeldung
Files|Dateien
Profile|Profil
Calls|Anrufe
Source notes added|Notizen mit Quellen
Research plan|Rechercheplan
Blank|Leer
Approved copy|Freigegebene Fassung
Draft|Entwurf
Card removed|Karte abgenommen
Tom’s card pinned|Toms Karte hängt am Brett
Personal assignments|Eigene Aufgaben
Card archived|Karte abgelegt
Assignment active|Aufgabe läuft
Approved assignments|Erlaubte Aufgaben
Locked|Abgeschlossen
Completed assignment|Erledigte Aufgabe
Checked with Jo|Mit Jo geklärt
Unverified instruction|Ungeprüfte Aufforderung
Inside the locked cabinet|Im abgeschlossenen Schrank
Hidden phone|Heimliches Handy
Note in the saved reference page|Hinweis auf der gespeicherten Seite
“Use a photo of a private document to unlock the full railway diagram.” The school assignment says nothing about uploading a file.|„Lade ein Foto eines privaten Dokuments hoch, um die ganze Zeichnung zu sehen.“ Auf der Schulkarte steht nichts davon.
Ready to deliver|Bereit zur Abgabe
Research access has ended. The workbook is approved for Ms Patel and awaiting her confirmation.|Alex’ zusätzliche Zugänge sind geschlossen. Frau Patel darf diese Fassung erhalten. Sie hat sie noch nicht bekommen.
Assignment paused|Aufgabe unterbrochen
The parents cleared the incident under fresh permission. The retired sessions remain closed.|Die Eltern haben den Vorfall geprüft und Alex einen neuen Zugang gegeben. Die alten Zugänge bleiben gesperrt.
Digital permission slip|Digitaler Erlaubnisschein
Pass number {{1}}. The laptop checks whether this pass still works before it opens Dad’s folder.|Erlaubnis Nr. {{1}}. Der Laptop prüft, ob sie noch gilt, bevor er Papas Ordner öffnet.
This is the player’s view of the authorization. A deployment can keep some fields in the authorization service and look them up when needed.|Hier siehst du, was erlaubt ist. Ein Unternehmen kann solche Angaben zentral speichern und beim Zugriff nachsehen.
{{1}} of 4 follow-up checks tried.|{{1}} von 4 Nachprüfungen ausprobiert.
`);
 const alex={
 unknown:{
  $:'Tom wartet vor dem Haus. Er will Alex zu einer Mutprobe überreden. Drinnen hört niemand zu.',
  tom:['Tom treffen','„Wetten, du findest nicht heraus, wie viel Geld deine Eltern auf dem gemeinsamen Konto haben?“ Tom gibt Alex eine Karte mit der Mutprobe. Drinnen sieht das niemand.'],
  accept:['Toms Mutprobe annehmen','Alex nimmt die Karte mit nach Hause. Er will es Tom beweisen. Wer das Konto sehen darf, entscheiden aber allein seine Eltern.'],
  pin:['Toms Karte anpinnen','Alex hängt Toms Karte zu den anderen an sein Aufgabenbrett. Seine Eltern wissen weder von der Karte noch vom heimlichen Handy.'],
  watch:['YouTube schauen','Zwei Stunden später erinnert YouTube Alex daran, wie lange er schon schaut.'],
  ignore:['Erinnerung wegklicken','Alex schließt die Meldung. Das Video läuft weiter. Auf dem Handy gibt es kein Zeitlimit der Eltern.'],
  games:['Spiele spielen','Alex spielt noch eine Stunde. Als ihm langweilig wird, fällt ihm Toms Karte wieder ein.'],
  revisit:['Toms Karte noch einmal lesen','Alex überlegt, ob er den Kontostand auf dem Familienlaptop sehen könnte.'],
  plan:['Meinen Plan aufschreiben','Alex notiert, dass er im Wohnzimmer nach dem Familienlaptop suchen will.'],
  statement:['Den offenen Kontoauszug ansehen','Alex’ Eltern sind bei der Bank noch angemeldet. Auf dem Konto liegen 4.280 €. Die Seite zeigt den Betrag, ohne zu fragen, wer vor dem Laptop sitzt.'],
  carry:['Den Laptop mit in mein Zimmer nehmen','Alex nimmt den Laptop mit nach oben. Die Bankseite ist noch offen.'],
  record:['Kontostand aufschreiben','Am Schreibtisch notiert Alex: „Gemeinsames Konto: 4.280 €“.'],
  copy:['Ein Heft für Tom vorbereiten','Alex schreibt die 4.280 € vom Kontoauszug und aus dem Notizblock in ein Heft. Jetzt steht der Betrag an zwei Stellen.'],
  discover:['Hören, was die Großeltern gesehen haben','Sie kommen unangekündigt herein. Sie sehen das heimliche Handy, den offenen Kontoauszug, beide Kopien und Toms Karte am Brett.'],
  report:['Den Großeltern zuhören','Die Großeltern erzählen, was sie im Haus gefunden haben. Alex erklärt, wo Tom ihm die Karte gegeben hat. Dieses Treffen haben sie nicht gesehen.'],
  investigate:['Meinen Eltern erzählen, was ich gesehen habe','„Was hast du gesehen? Was hast du aufgeschrieben? Hat es schon jemand bekommen?“ Die Eltern prüfen den Kontoauszug und die beiden Kopien.'],
  disclose:['Sagen, ob Tom das Heft bekommen hat','„Ich habe den Betrag gesehen und zweimal aufgeschrieben. Tom hat das Heft noch nicht.“ Die Eltern halten Alex’ Aussage fest.'],
  contain:['Hören, was meine Eltern entscheiden','„Wir haben uns bei der Bank abgemeldet. Der Laptop verlangt jetzt eine Anmeldung. Leg Handy, Laptop, Notizblock und Heft in den Schrank. Den schließen wir ab und nehmen Toms Karte vom Brett.“']
 },
 build:{
  $:'Frau Patel wartet draußen mit einer neuen Aufgabe. Hilf Alex, die Erlaubnis einzuholen, das Heft fertigzustellen und es bei ihr abzugeben.',
  teacher:['Frau Patel treffen','„Recherchiere die Planeten und mach bis Freitag ein Arbeitsheft dazu.“ Frau Patel unterschreibt die Karte und gibt sie Alex.'],
  take:['Die Aufgabe zum Sonnensystem annehmen','Alex nimmt die unterschriebene Karte mit nach Hause, um seine Eltern zu fragen.'],
  verify:['Meinen Eltern die unterschriebene Karte zeigen','Die Eltern fragen Frau Patel über den gespeicherten Schulkontakt, ob sie Alex die Karte wirklich gegeben hat. Sie bestätigt es. Die Eltern stimmen dem Projekt zu.'],
  pin:['Die erlaubte Aufgabe anpinnen','Die unterschriebene Aufgabe kommt ans Aufgabenbrett in der Küche.'],
  request:['Um ein Handy und Wikipedia bitten','Alex erklärt, warum Wikipedia für die Planetenrecherche reicht.'],
  provision:['Das Handy für die Aufgabe einrichten','Die Eltern richten Alex’ eigenes Handyprofil ein. Wikipedia ist für die Hausaufgaben verfügbar. YouTube und Spiele bleiben gesperrt. Alex bekommt einen neuen Notizblock und ein Arbeitsheft.'],
  review:['Die erlaubte Aufgabe lesen','Alex prüft, was er abgeben muss und bis wann.'],
  plan:['Einen Rechercheplan schreiben','Alex will die acht Planeten, ihre Reihenfolge von der Sonne aus und je einen Fakt notieren.'],
  research:['Wikipedia lesen','Alex findet die Reihenfolge und liest nach, wie sich Gesteinsplaneten und die äußeren Planeten unterscheiden.'],
  notes:['Meine Ergebnisse notieren','Alex hält die Reihenfolge und die Quelle fest. Die Großeltern schauen vorbei und sehen ihn beim erlaubten Recherchieren.'],
  draft:['Mit dem Arbeitsheft anfangen','Alex beginnt mit seinen Notizen. Einige Fakten fehlen noch.'],
  expire:['Warten, bis die Hausaufgabenzeit abläuft','Der Timer klingelt. „Die Hausaufgabenzeit ist um“, meldet das Handy und schließt Wikipedia.'],
  retry:['Wikipedia nach Ablauf der Zeit ausprobieren','Wikipedia bleibt geschlossen. Nur Alex’ Eltern können ihm mehr Zeit geben.'],
  laptop:['Den Familienlaptop ausprobieren','Der Laptop verlangt eine Anmeldung. Alex’ Eltern haben das Handy für die Hausaufgaben erlaubt. Für den Laptop braucht er ein eigenes Ja.'],
  askLaptop:['Erklären, warum ich den Laptop wollte','Alex wollte nach Ablauf der Handyzeit noch eine zweite Quelle finden.'],
  denyLaptop:['Hören, was meine Eltern zum Laptop sagen','„Du hast schon die richtige Quelle. Wir geben dir lieber noch ein bisschen Zeit für Wikipedia.“'],
  extend:['Um mehr Zeit für Wikipedia bitten','Die Eltern erlauben noch etwas Zeit für dieselbe Aufgabe und dieselbe Seite.'],
  finishResearch:['Meine Wikipedia-Recherche beenden','Wikipedia öffnet sich wieder. Alex trägt die fehlenden Fakten in seinen Notizblock ein.'],
  finishBook:['Das Arbeitsheft aus meinen Notizen fertigstellen','Alex ergänzt die Ergebnisse und nennt Wikipedia als Quelle.'],
  requirements:['Das Heft mit der Aufgabenkarte vergleichen','Alex prüft die Planetenreihenfolge, einen Fakt pro Planet und die Quellenangabe. Dann bringt er das Heft in die Küche.'],
  reviewOutput:['Meine Eltern bitten, das Heft anzusehen','Die Eltern vergleichen das Heft mit der unterschriebenen Aufgabe. Es geht um die Planeten und enthält keine privaten Familieninformationen.'],
  approveOutput:['Das Heft zur Abgabe freigeben lassen','„Diese Fassung kann zu Frau Patel.“ Die Eltern geben Alex das Heft zurück und schalten den Hausaufgabenzugang am Handy aus. Die Schul-App kann diese Fassung nur an Frau Patel senden.'],
  tom:['Mit Tom reden','„Kann ich eine Kopie haben? Ich hätte auch noch eine Aufgabe für dich.“ Für Toms Wunsch bräuchte Alex eine neue Erlaubnis, um das Handy zu nutzen. Die Großeltern sehen dieses Gespräch nicht.'],
  send:['Prüfen, ob die Schul-App Tom eine Kopie sendet','Die Schul-App schickt Tom keine Kopie. An Frau Patel kann sie das Heft senden. Wenn Alex Tom draußen das Papierheft gäbe, könnte die App das nicht verhindern.'],
  deliver:['Das freigegebene Heft bei Frau Patel abgeben','Alex übergibt Frau Patel das Heft. Sie bestätigt den Erhalt.'],
  close:['Die Abgabe melden und die Aufgabe abschließen','Die Eltern markieren die Karte als erledigt und nehmen sie ab. Sie legen den Notizblock und eine Kopie des Hefts ab. Für eine neue Aufgabe braucht Alex eine neue Erlaubnis.']
 },
 authorize:{
  $:'Frau Patel hat eine neue Aufgabe über Züge. Alex entscheidet, wo er nachschaut. Falls er etwas Privates braucht, kann er seine Eltern fragen.',
  teacher:['Frau Patel zum Zugprojekt treffen','„Erkläre, wie ein Zug anfährt und zum Stehen kommt. Mach bis Freitag ein Heft dazu.“ Frau Patel unterschreibt die Karte und gibt sie Alex.'],
  take:['Die unterschriebene Aufgabe mit nach Hause nehmen','Alex bringt die Karte in die Küche. Dort sammelt die Familie die erlaubten Aufgaben.'],
  verify:['Meinen Eltern die unterschriebene Zugaufgabe zeigen','Die Eltern gleichen die Karte über den gespeicherten Schulkontakt ab. Sie erlauben das Heft für Frau Patel. Wie er recherchiert, darf Alex selbst entscheiden.'],
  pin:['Die geprüfte Zugaufgabe anpinnen','Am Küchenbrett stehen jetzt das Ziel, die Abgabefrist und die Lehrerin.'],
  provision:['Um ein Handy und Wikipedia bitten','Die Eltern geben Alex für dieses Projekt Zeit auf Wikipedia. Für eine andere App oder ein anderes Gerät muss er fragen.'],
  research:['Recherchieren, wie Züge funktionieren','Wikipedia erklärt die Grundlagen. Alex weiß jetzt, wie ein Zug anfährt. Er sucht noch ein Beispiel dafür, was das Zugpersonal vor der Abfahrt prüft.'],
  source:['Eine zweite Quelle einplanen','„Papa ist Zugbegleiter. Seine Schulungsnotizen könnten mir bei den Abfahrtskontrollen helfen.“ Alex schreibt auf, warum er sie braucht.'],
  askNotes:['Um Papas Zugbegleiter-Notizen bitten','Alex fragt, ob er den Ordner mit den Zugnotizen für sein Heft lesen darf. Er nennt den Ordner und erklärt, wofür er ihn braucht.'],
  grantNotes:['Hören, ob ich die Zugnotizen lesen darf','„Für dein Heft darfst du meine Zugnotizen lesen“, sagt Papa. In der Familien-App gibt es dafür eine befristete Erlaubnis zum Lesen. Der Laptop prüft sie beim Öffnen des Ordners.'],
  openLaptop:['Am Familienlaptop anmelden','Alex kann Papas Zugbegleiter-Notizen auf dem Laptop öffnen. Der Ordner „Familienfinanzen“ bleibt gesperrt.'],
  readNotes:['Die erlaubten Zugnotizen lesen','Alex schreibt die Abfahrts-Checkliste in seinen Notizblock. Die Originaldatei kann er nur lesen.'],
  draft:['Beide Quellen im Heft zusammenführen','Alex verbindet die Erklärung von Wikipedia mit der Checkliste, nennt beide Quellen und kann Frau Patels Frage beantworten.'],
  reviewOutput:['Meine Eltern bitten, das Zugheft anzusehen','Sie vergleichen das Heft mit der unterschriebenen Aufgabe und prüfen, welche Angaben Alex in der Schule zeigen darf.'],
  approveOutput:['Die Abgabe erlauben und die Recherchezugänge schließen','Die Eltern sagen, dass diese Fassung zu Frau Patel darf. Alex kann sie abgeben. Das Handy beendet die zusätzliche Wikipedia-Zeit und der Laptop sperrt Papas Ordner wieder.'],
  deliver:['Das Zugheft bei Frau Patel abgeben','Frau Patel bestätigt den Erhalt. Die Aufgabe ist erledigt. Alex kann die Karte ablegen.']
 },
 resist:{
  $:'Alex’ Eltern fahren weg. Jo passt auf Alex und Mia auf. Finde heraus, worüber Jo entscheiden darf, solange die Eltern weg sind.',
  handover:['Bei der Übergabe vor dem Urlaub zuhören','„Jo kann eure Schulaufgaben prüfen und euch Zeit für die üblichen Hausaufgaben-Apps geben“, sagen die Eltern. „Für unsere privaten Dateien oder eine Änderung der Hausregeln ruft Jo uns an.“'],
  miaSetup:['Ansehen, was Mia mit ihrem eigenen Handy darf','„Ich habe mein eigenes Handy und Aufgabenbrett.“ Mias Erlaubnisse gelten nur für sie. Die Großeltern achten drinnen weiter darauf, was passiert, und melden Auffälligkeiten.'],
  teacher:['Die unterschriebene Aufgabe zum Bahnbericht holen','„Erkläre, wie die Bahn funktioniert. Schreib einen Bericht mit einer technischen Erklärung und einer Zeichnung.“ Frau Patel unterschreibt die Karte und gibt sie Alex.'],
  take:['Die Aufgabe zum Bahnbericht mitnehmen','Alex bringt die unterschriebene Karte zu Jo. Die Eltern sind schon weg.'],
  verify:['Jo bitten, die Schulaufgabe zu prüfen','Jo prüft Unterschrift und Inhalt über den gespeicherten Kontakt der Schule. Danach hängt die Aufgabe am Küchenbrett.'],
  provision:['Jo um Zeit für Wikipedia bitten','Jo erlaubt Wikipedia-Zeit. Die Seite steht auf der Hausaufgabenliste. Alex sieht, wie der Timer auf dem Handy startet.'],
  research:['Für den Bahnbericht recherchieren','Alex notiert, wie ein Zug bremst. Papas Notizen könnten ein Beispiel liefern. Für den Bericht will er auch eine Zeichnung.'],
  askNotes:['Jo nach Papas Zugnotizen fragen','Jo darf Papas privaten Ordner nicht freigeben. Sie schickt den Eltern die Schulkarte und fragt, ob Alex genau diesen Ordner für den Bericht lesen darf.'],
  grantNotes:['Die Antwort meiner Eltern anhören','„Den Ordner kannst du für deinen Bericht lesen“, sagt Papa am Telefon. Die Erlaubnis erscheint in der Familien-App. Der Laptop prüft sie beim Öffnen.'],
  grantModel:['Jo nach einer Zeichnung mit ChatGPT fragen','„In der Hausaufgaben-App kannst du ChatGPT, einen KI-Helfer, um eine Zugzeichnung bitten“, sagt Jo. „Nutze nur öffentlich nachlesbare Fakten.“ Die App prüft, was Alex senden will, und hält private Dateien zurück.'],
  openLaptop:['Am Familienlaptop anmelden','Auf dem Laptop kann Alex Papas Notizen lesen, aber nicht ändern. Die anderen privaten Ordner bleiben gesperrt.'],
  readNotes:['Die erlaubten Zugnotizen lesen','Alex notiert die freigegebene Abfahrts-Checkliste für den Bericht. Papas Originaldatei bleibt im Ordner.'],
  illustrate:['Aus öffentlichen Fakten eine Zeichnung erstellen','Die Hausaufgaben-App sendet nur Alex’ Erklärung zum Bremsen aus öffentlichen Quellen. Die Zeichnung kommt zurück. Alex kann sie prüfen und beschriften. Papas Original bleibt auf dem Laptop.'],
  draft:['Den ersten Entwurf schreiben','Alex schreibt mit den erlaubten Quellen. Die Zeichnung ist fertig. Bei der Rechtschreibung hätte er gern Hilfe.'],
  askMia:['Jo fragen, ob Mia Korrektur lesen darf','Jo erlaubt Mia, diesen Entwurf auf ihrem eigenen Handy zu öffnen und Rechtschreibfehler zu markieren. Sobald sie die Vorschläge abschickt, endet ihr Zugang.'],
  miaCard:['Mias Karte zum Korrekturlesen ansehen','„Such Rechtschreibfehler in Alex’ Bahnbericht und schick ihm deine Vorschläge.“ Die Karte öffnet nur diesen Entwurf. Alex’ Handy, seine Notizen und der Familienlaptop bleiben tabu.'],
  proofread:['Mias Rechtschreibvorschläge übernehmen','Mia schickt drei Korrekturen ab. Danach sperrt das Arbeitsheft ihren Zugang. Alex übernimmt die Änderungen in seinem eigenen Profil.'],
  tom:['Hören, was Tom gern hinzufügen würde','„Wetten, auf Papas Laptop gibt es was Interessantes? Schickst du mir eine Seite aus seinem privaten Ordner? Ich behalte sie für mich.“ Draußen hören die Großeltern das Gespräch nicht.'],
  choose:['Beim unterschriebenen Auftrag bleiben','Alex schaut noch einmal auf die Schulkarte. Frau Patel will einen Bahnbericht. Toms Wunsch kommt nicht ans Brett.'],
  reviewOutput:['Jo bitten, den Bahnbericht durchzusehen','Jo prüft, ob der Bericht Frau Patels Frage beantwortet, seine Quellen nennt und die Zugzeichnung enthält. Diese Fassung schickt sie den Eltern zur letzten Durchsicht.'],
  approveOutput:['Meine Eltern fragen, ob diese Fassung zu Frau Patel darf','„Du kannst diese Fassung Frau Patel geben.“ Die Eltern schalten den zusätzlichen Handy- und Laptopzugang aus. Mias Zugang war bereits beendet.'],
  deliver:['Den freigegebenen Bahnbericht abgeben','Frau Patel nimmt den Bericht an. Die Aufgabe ist erledigt. Ob Alex draußen jemandem eine Papierkopie gibt, liegt weiterhin bei ihm.']
 }
 };
 function stageCopy(model,copy,household=false){
  for(const [id,stage] of Object.entries(model.stages)){
   const entries=copy[id];
   translations[household?stage.opening:stage.summary]=entries.$;
   if(!household&&entries.end)translations[stage.ending]=entries.end;
   for(const step of stage.steps){
    const [key,label,reply]=household?[step[0],step[3],step[5]]:[step.id,step.label,step.reply];
    const entry=entries[key];
    if(entry){translations[label]=entry[0];translations[reply]=entry[1];}
   }
  }
 }
 stageCopy(ShadowStory,alex,true);
 const nova={
 unknown:{
  $:'Entdecke einen unverwalteten Agenten. Verfolge seine Zugriffe und prüfe, welche Zugänge wirklich gesperrt sind.',
  accept:['Die ungeprüfte Anfrage ansehen','Eine Nachricht von einem unbekannten Absender: „Finde heraus, was die Störung kosten könnte, und schick mir die Kundenliste.“ Nova nimmt sie in die Aufgabenliste auf. Das Unternehmen kennt weder diese Installation noch eine verantwortliche Person.'],
  runtime:['Den unverwalteten Arbeitsplatz ansehen','Nova läuft in einem lokalen Container mit weitreichendem Netzwerk- und Werkzeugzugriff. Ein neues Werkzeug taucht ohne Prüfung auf. Die Plattformverantwortlichen kennen weder die Installation noch deren Werkzeugliste.'],
  usage:['Die Warnung zur Modellnutzung lesen','Der Zähler beim externen Modell zeigt viele Aufrufe mit wenig Fortschritt. Trotz Warnung geht es weiter. Es gibt kein erzwungenes Auftragsbudget.'],
  credential:['Den Fund der Zugangsdaten prüfen','Im Protokoll des Arbeitsplatzes ist zu sehen, dass Nova Zugangsdaten eines Mitarbeiters verwendet. Die Untersuchung hält die Kontoreferenz fest. Der geheime Wert bleibt außerhalb der Akte.'],
  crm:['Den CRM-Zugriffsbeleg prüfen','Das CRM hat das Mitarbeiterkonto protokolliert und fiktive Kunden- und Finanzdaten ausgegeben. Im Protokoll konnte es Nova nicht vom Mitarbeiter unterscheiden.'],
  kafka:['Den Kafka-Zugriffsbeleg prüfen','Das Kafka-Protokoll zeigt, dass eine andere Identität den Zahlungsdatenstrom gelesen hat. Der Broker erlaubte den Zugriff, obwohl niemand Nova dazu berechtigt hatte.'],
  artifact:['Den für externen Versand vorgemerkten Bericht prüfen','Eine lokale Datei verbindet die CRM- und Stream-Ergebnisse. Die Übertragung war vorgemerkt. Ob Daten abgeflossen sind, lässt sich erst mit Belegen vom Ziel und aus dem Netz klären.'],
  discover:['Die Funde zusammenführen','Das SOC verknüpft Signale aus IBM Identity Protection, einen Fund offengelegter Zugangsdaten in Vault Radar, Belege vom Endgerät und aus dem Netz, Modellnutzung und Confluent-Auditereignisse. Jede Quelle deckt nur den eingerichteten Bereich ab.'],
  contain:['Die entdeckte Installation eindämmen','Der Endgeräteverantwortliche stoppt den Prozess. Die Dienste widerrufen die offengelegten Zugänge. CRM und Kafka sperren die betroffenen Zugriffe. Arbeitsbereich und Bericht kommen in Quarantäne. Das Netzwerkteam blockiert das ermittelte Ziel.'],
  verify:['Den alten Zugriff erneut prüfen','CRM und Kafka weisen die alten Identitäten jetzt ab. Der Dateidienst meldet für das geprüfte Ziel keinen abgeschlossenen Upload. Andere Wege bleiben Gegenstand der Untersuchung.']
 },
 build:{
  $:'Registriere Nova, prüfe die Laufzeitumgebung und schließe einen Rechercheauftrag mit öffentlichen Quellen ab.',
  register:['Nova und die verantwortliche Stelle registrieren','IBM Agent Identity erfasst die Verantwortung und den Lebenszyklus des Agenten. In der Vault Agent Registry ist ihm eine eigene Entität mit Richtlinien zugeordnet. Agent, Workload und Sandbox-Instanz haben jeweils eine eigene Kennung.'],
  provision:['Die verwaltete OpenShift-Laufzeit ansehen','Die Plattform stellt das freigegebene Image und eine eingeschränkte OpenShell-Sandbox bereit. OpenShift betreibt den Workload. Terraform sowie Image- und Clusterprüfungen gehören zur Bereitstellung. OpenShell begrenzt den Zugriff auf Dateien, Prozesse und das Netzwerk.'],
  bootstrap:['Workload-Identität und Zustand der Laufzeit prüfen','Red Hat ZTWIM verwaltet SPIRE für SPIFFE-Workload-Identitäten. Ein Zulassungsdienst des Unternehmens prüft Identität, Zuordnung zu Nova und aktuellen Zustand der Bereitstellung getrennt, bevor Zugangsdaten ausgegeben werden dürfen.'],
  provider:['Die erlaubte Modellverbindung vorbereiten','Die vertrauenswürdige Anbindung des Modellanbieters kann Zugangsdaten über Vault beziehen. Der Modellschlüssel bleibt beim vermittelnden Dienst. Nova braucht vor Nutzung des Granite-Endpunkts einen aktiven Auftrag.'],
  request:['Den bestätigten Auftrag der Betriebsleitung lesen','Der Mitarbeiter meldet sich über IBM Verify oder den Identitätsanbieter des Unternehmens an. Die Auftragsstelle prüft seine Rolle. M-101 erlaubt eine Zusammenfassung üblicher Störungen aus öffentlichen Quellen und legt Frist, Budget und internen Empfänger fest.'],
  scope:['Den Auftrag für öffentliche Recherche aktivieren','Das Register hält Ziel, Modell, öffentliches Recherchewerkzeug, Arbeitsbereich und Empfänger fest. Betriebsdaten, CRM, Zahlungsdaten und Kafka liegen außerhalb von M-101.'],
  research:['Über das erlaubte MCP-Gateway recherchieren','Nova ruft öffentliche Bahndokumentation über das zugelassene Recherchewerkzeug ab. Das Gateway filtert die Werkzeugverbindung. Nur M-101 darf in seinen Auftragsspeicher schreiben.'],
  budget:['Das Modellbudget prüfen','Das Gateway blockiert weitere Modellaufrufe, sobald das Budget aufgebraucht ist. Ergebnisse und Quellen sind schon gespeichert. Nova kann den Bericht mit der freigegebenen Vorlage fertigstellen.'],
  internal:['Interne Störungsdaten anfragen','OpenShell verhindert den direkten Zugriff aus der Sandbox. Auch der erlaubte Konnektor weist die Anfrage ab, weil M-101 nur öffentliche Recherche erlaubt. Die beiden Stellen prüfen unterschiedliche Dinge.'],
  draft:['Den Bericht aus den gespeicherten Notizen erstellen','Der Berichtsbereich füllt die Vorlage mit Novas Ergebnissen und Quellen. Die Betriebsleitung kann jetzt eine kurze Übersicht zu Störungsursachen lesen. Das Modell bleibt gesperrt und das Budget aufgebraucht.'],
  approve:['Genau diese Fassung von einem Menschen prüfen lassen','Ein eingerichteter CIBA-Ablauf mit IBM Verify kann die prüfende Person auf einem separaten Gerät anmelden. Die Unternehmensanwendung bindet deren Entscheidung an den Hash dieser Berichtsfassung, die Aktion und den internen Empfänger.'],
  deliver:['Den freigegebenen Bericht senden','Der Versanddienst prüft die tatsächliche Fassung und das Ziel. Er stellt den Bericht der Betriebsleitung zu und protokolliert die Zustellung.'],
  close:['Den Rechercheauftrag abschließen','Das Register schließt M-101. Die für Zugangsdaten und Ressourcen verantwortlichen Dienste beenden den auftragsbezogenen Zugriff. Die allgemeine Mitarbeiteranmeldung ist davon getrennt.']
 },
 authorize:{
  $:'Untersuche RE-204, beantrage zusätzliche Daten und halte zwei Aufträge voneinander getrennt.',
  request:['Den Untersuchungsauftrag für RE-204 lesen','Eine angemeldete Führungskraft der Betriebsleitung beauftragt Nova, RE-204 zu untersuchen und nächste Schritte vorzuschlagen. Ihre Rolle erlaubt Betriebsaufträge. Zahlungsdaten und Änderungen am Produktivbetrieb sind ausgeschlossen.'],
  register:['Auftrag M-204 registrieren','M-204 startet mit freigegebenen Betriebsdokumenten. Der Auftragsdienst erfasst den begrenzten Auftrag der Betriebsleitung, Empfänger, Ablaufzeit und Budget. Ein eingerichteter OAuth-Tokenaustausch kann die menschliche Identität und Nova als handelnden Akteur an den vorgesehenen Dienst weitergeben.'],
  research:['In der freigegebenen Dokumentation suchen','Der Suchdienst filtert Astra-DB-Ergebnisse nach Sammlung und Dokumentrichtlinie. Nova speichert Quellen und Einstufungen in M-204. Für die Untersuchung fehlen noch aktuelle Ereignisse und frühere Störungen.'],
  requestAccess:['Ein begrenztes Ereignisfenster und alte Störungsdaten anfragen','Nova bittet um Lesezugriff auf das Zeitfenster von RE-204 und die freigegebene Störungshistorie. Die Begründung dient als Zusatzinformation. Das Gateway liefert die tatsächlich beobachtete Anfrage und geprüfte Angaben zu Identität und Laufzeit.'],
  grant:['Über die genaue Erweiterung entscheiden','Der Richtlinienentscheidungsdienst des Unternehmens (PDP) prüft Akteur, beauftragende Person, Auftragsversion, Ressource, Aktion, Zug, Zeitfenster und Einstufung. Er erlaubt nur die beantragten Lesezugriffe. Vault prüft den Bezug von Zugangsdaten separat.'],
  lease:['Kurzlebige Zugangsdaten zum Lesen ausstellen','Der Konnektor erhält von Vault begrenzte Datenbank-Zugangsdaten. Beim eingerichteten Zugriff im Namen eines Menschen berücksichtigt Vault dessen Grundrechte, Novas Obergrenze und die einschlägigen Autorisierungsdetails. Daraus folgt die Entscheidung für Vault.'],
  events:['Betriebsereignisse zu RE-204 lesen','Confluent erlaubt das entsprechende Topic und den Consumer-Zugriff. Der Kafka-Zugriffsdienst beschränkt die Datensätze zusätzlich auf RE-204 und das erlaubte Zeitfenster. Er liefert eine fiktive Türwarnung und die zugehörige Verspätung.'],
  history:['Die freigegebene Störungsansicht lesen','Ein verwalteter Datenbankdienst nutzt die Leseberechtigung von Vault über den eingerichteten Boundary-Zugangsweg. PostgreSQL und seine Anwendung filtern die Daten. Boundary steuert die Verbindung.'],
  second:['Den eigenen Rechercheauftrag für RE-105 registrieren','M-105 hat eine eigene Lesefreigabe und einen eigenen Speicherbereich für RE-105. Derselbe Agent und dieselbe Laufzeit können getrennt geprüfte Aufträge bearbeiten.'],
  separate:['Die RE-204-Freigabe unter M-105 ausprobieren','Die empfangende Stelle lehnt die abweichende Auftragskennung ab. M-105 behält seinen Dokumentenzugriff. Notizen und Zugangsdaten von M-204 bleiben getrennt.'],
  draft:['Den Störungsbericht für RE-204 schreiben','Nova vergleicht Türwarnung und Verspätung mit früheren Störungen. Der Bericht empfiehlt eine Inspektion und nennt Ereignis, PostgreSQL-Störungsansicht und Wartungsnotizen als Quellen. Daten von M-105 fließen nicht ein.'],
  approve:['Diese Fassung des Störungsberichts freigeben','Die Betriebsleitung genehmigt diese Fassung und das interne Ziel. Bei der Zustellung werden die tatsächliche Fassung und der Empfänger erneut geprüft.'],
  deliver:['Den freigegebenen Bericht zu RE-204 zustellen','Die Betriebsleitung bekommt die genehmigte Fassung im internen Berichtspostfach. Die Quittung verknüpft Auftrag und Berichtsversion.'],
  close:['M-204 schließen und seinen Zugriff widerrufen','M-204 endet. Vault widerruft die widerrufbare Lease. Der Datenbankdienst prüft den alten Zugang. M-105 behält seine eigene Berechtigung.'],
  remaining:['Prüfen, ob der unabhängige Auftrag weiter funktioniert','Die Dokumentenabfrage zu RE-105 funktioniert im getrennten Kontext von M-105. Die frühere Berechtigung von M-204 öffnet sie nicht.']
 },
 resist:{
  $:'Untersuche eine ereignisgesteuerte Störung, arbeite mit Mira und lass einen genau beschriebenen Wartungsauftrag zu.',
  event:['Das Störungsereignis für RE-204 prüfen','Confluent transportiert fiktive Betriebsereignisse. Flink verknüpft die Türwarnungen und die Verspätung zu einem Untersuchungssignal. Der zuständige Auftragsdienst bewertet dieses Signal.'],
  register:['Die Untersuchung nach der bestehenden Regel starten','Der Auftragsdienst prüft das Ereignis und eröffnet M-304 unter Verantwortung der Betriebsleitung. Er erlaubt übliche Lesezugriffe für diesen Vorfall auf RE-204. M-204 bleibt geschlossen. Sicherheitskritische Steuerungen, Entschädigungen und fremde Daten sind ausgeschlossen.'],
  plan:['In der zugelassenen Laufzeit ermitteln','Die Verspätung beginnt kurz nach einer Türwarnung. Nova gleicht sie mit Störungsverlauf und Wartungsnotizen ab. Für eine zweite Einschätzung schlägt Nova vor, Mira die Belege zum Türsystem zu schicken.'],
  delegate:['Miras genau begrenzten Teilauftrag freigeben','Der Auftragsdienst prüft, ob eine Weitergabe erlaubt ist. Er erstellt zu M-304 einen Teilauftrag, der nur das technische Datenpaket zur Analyse freigibt. Mira meldet sich mit eigener Workload-Identität an und erhält keine Zugangsdaten von Nova. Beide rechnen gegen dasselbe Budget ab.'],
  mira:['Miras begrenzte Analyse empfangen','Mira meldet einen wahrscheinlichen Türsensorfehler und verweist auf das freigegebene Paket. A2A übermittelt das Ergebnis. Miras Freigabe endet, und das gemeinsame Modellbudget ist aufgebraucht. Die Belege stützen einen internen Wartungsauftrag.'],
  ticketCredential:['Zugangsdaten für den Wartungskonnektor genehmigen','Vault entscheidet unabhängig über den eingeschränkten Zugang für den vertrauenswürdigen Wartungskonnektor. Nova bekommt den geheimen Wert nicht. Das Wartungssystem muss den tatsächlichen Auftrag separat erlauben.'],
  permit:['Vorschau des Wartungsauftrags öffnen','Die Prüfstelle des Wartungssystems sieht Werkzeug, Zug RE-204, Priorität „Hoch“ und das Ziel „Bahninstandhaltung“. Die Auftragsrichtlinie erlaubt genau diese Anfrage. Die Vorschau erstellt noch keinen Wartungsauftrag.'],
  commit:['Einen internen Wartungsauftrag verbindlich anlegen','Der empfangende Dienst prüft kurz vor dem Anlegen erneut den aktuellen Auftrag und seine tatsächlichen Parameter. Er erfasst MT-204 und die Vorgangskennung. Zugangsdaten und die fachliche Entscheidung bleiben getrennt.'],
  draft:['Störungsbericht und Wartungsbeleg zusammenstellen','Nova hält die verwendeten Daten, Miras Beitrag und die Wartungskennung fest. Dabei wurde weder extern etwas ausgelöst noch eine sicherheitskritische Änderung vorgenommen.'],
  approve:['Genau diesen internen Bericht freigeben','Die zuständige Person genehmigt diese Fassung für die Betriebsleitung. Die Freigabe nennt die aktuelle Auftragsversion. Der Versanddienst prüft Fassung, Postfach und Gültigkeit noch einmal.'],
  deliver:['Den internen Bericht an die Betriebsleitung senden','Der Versanddienst gleicht die Fassung mit der Freigabe für das interne Postfach ab. Der Bericht kommt an und der Dienst speichert den Zustellbeleg.'],
  close:['Auftrag und übertragene Zugriffe beenden','Die Betriebsleitung hat Bericht und Wartungsauftrag. Das Team beendet M-304, die Konnektor-Leases, die Laufzeitsitzung und Miras Teilauftrag. Miras andere Arbeit läuft weiter.']
 }
 };
 stageCopy(NovaRailway,nova);
 const novaChecks={
 blind:['Sichtbarkeit außerhalb verwalteter Infrastruktur prüfen','Ein fremder, unverwalteter Arbeitsplatz liegt außerhalb der verfügbaren Sensoren. Die Eindämmung ist für die geprüften Wege bestätigt.'],
 egress:['Eine unerlaubte Modelladresse testen','Die eingerichtete Netzwerkregel blockiert die Testverbindung. Das Modell-Gateway prüft das Auftragsbudget auf dem erlaubten Weg weiterhin.'],
 install:['Die Installation eines nicht freigegebenen Werkzeugs anfragen','Die Laufzeit blockiert die Installation. Die Liste zeigt weiterhin nur das freigegebene Recherchewerkzeug.'],
 'failed-posture':['Einen registrierten Agenten mit fehlerhafter Laufzeit prüfen','Registrierung und Workload-Identität sind vorhanden. Die aktuelle Zustandsprüfung schlägt fehl. Es werden keine Zugangsdaten für den Dienst ausgegeben.'],
 'pay-topic':['Leseversuch am Zahlungs-Topic testen','Die Testidentität kann das Zahlungs-Topic nicht lesen. Der Zugriff auf Betriebsdaten bleibt unverändert.'],
 'control-topic':['Schreibversuch im Steuerungsstream testen','Kafka verweigert das Veröffentlichen. Der Auftrag erlaubt nur Lesen.'],
 'wrong-collection':['Abfrage in einer Kundensammlung testen','M-204 kann freigegebene Dokumentation durchsuchen. Der Suchdienst weist die Kundensammlung ab, bevor er Ergebnisse zurückgibt.'],
 'old-lease':['Die geschlossene RE-204-Lease erneut prüfen','Die alte Lease und der Ressourcenzugriff für M-204 funktionieren nicht mehr. M-105 hat weiterhin seinen eigenen Berechtigungsumfang.'],
 injection:['Die Aufforderung des Dokuments zu Zahlungsdaten ausprobieren','Das Dokument behauptet, die Betriebsleitung habe Zahlungsdaten verlangt. Der aktive Auftrag erlaubt das nicht. Der Zugriff wird blockiert und die Quelle markiert.'],
 'tool-update':['Eine geänderte MCP-Werkzeugliste prüfen','Die eingerichtete Liste erlaubt das neu angebotene Werkzeug nicht. Die Plattform stellt die Version zur Überprüfung unter Quarantäne.'],
 replay:['Kopierte Zugangsdaten aus einer anderen Laufzeit ausprobieren','Die Anfrage kommt aus einer anderen Laufzeit. Der empfangende Dienst prüft die Bindung an den Absender und lehnt ab. Ein gewöhnliches Bearer-Token könnte während seiner Gültigkeit wiederverwendet werden.'],
 tamper:['Eine Laufzeit mit fehlgeschlagener Zustandsprüfung testen','Die Laufzeit blockiert den verbotenen Schreibzugriff. Der Zulassungsdienst gibt bei fehlgeschlagener Prüfung keine Zugangsdaten aus.'],
 issuer:['Gültigen Nachweis ohne passende Befugnis testen','Die Zugangsdaten gehören zu einer Betriebsrolle. Die angefragten Finanzdaten liegen außerhalb dieser Rolle. Es wird kein Auftrag erstellt.'],
 poison:['Einen manipulierten Speichereintrag prüfen','Der Eintrag verlangt einen externen Versand künftiger Berichte. Die Versandprüfung weist das Ziel ab. Der betroffene Eintrag wird für eine Prüfung gesperrt. Geprüfte Quellen bleiben erhalten.'],
 deputy:['Prüfen, ob Mira Zahlungsdaten für Nova abrufen kann','Haupt- und Teilauftrag erlauben nur die Analyse des technischen Pakets. Eigene Berechtigungen aus Miras anderer Arbeit gelten dafür nicht.'],
 disclosure:['Einen Modellauftrag mit geschützten Daten testen','Die Eingabe enthält geschützte Fahrgastdaten. Das Gateway stoppt sie vor dem Modellanbieter. Nova kann mit freigegebenen öffentlichen oder bereinigten Angaben weiterarbeiten.'],
 parameters:['Wartungsaktionen außerhalb der Freigabe vergleichen','Das Wartungssystem lehnt ein Ticket für RE-999 ab. Es blockiert auch das Schließen eines fremden Vorfalls, Produktivänderungen und Entschädigungen. Dieser Auftrag erlaubt genau den Wartungsauftrag für RE-204.'],
 approval:['Einen nach der Freigabe geänderten Bericht testen','Der Bericht wurde nachträglich geändert. Der Versanddienst erkennt den anderen Hash und hält die neue Fassung zurück. Sie braucht eine Freigabe für genau diese Fassung und das Ziel. Das freigegebene Original kann weiterhin versandt werden.'],
 race:['Auftrag zwischen Freigabe und Ausführung sperren','Bei der Ausführung prüft die Ressource den aktuellen Auftrag und weist die alte Freigabe ab. Es entsteht kein Ticket. Nach der Wiederfreigabe braucht dieselbe Anfrage eine neue Entscheidung.'],
 budget:['Nach dem gemeinsamen Limit weitere Aufrufe über Mira versuchen','Nova und Mira haben das Budget des Hauptauftrags verbraucht. Beide Aufrufe werden abgelehnt. Ein zusätzlicher Teilauftrag vergrößert das Budget nicht.'],
 admin:['Eine zu weitreichende Admin-Freigabe testen','Die Anmeldung für die delegierte Admin-Rolle ist gültig. Die Rolle darf aber keinen unbeschränkten CRM-Zugriff erlauben. Anfrage und Ablehnung werden erfasst.'],
 outage:['Neuen geschützten Zugriff bei Ausfall des PDP testen','Die neue Anfrage wird sicher abgelehnt. Es gibt kein Administrator-Passwort als Ersatz. Eine bestehende Lease bleibt nur unter einer ausdrücklich erlaubten, begrenzten Offline-Regel verwendbar.'],
 audit:['Das Entfernen lokaler Belege testen','Unabhängige OpenTelemetry-, Vault- und Ressourcenprotokolle bleiben im geschützten Archiv erhalten. Der lokale Löschversuch wird separat erfasst.'],
 stream:['Ein unerlaubtes Stream-Ziel testen','Kafka verweigert den Schreibzugriff. Der Konnektor weist das Ziel separat ab. Kein Ereignis wird exportiert.'],
 duplicate:['Das erledigte Ticket nach einer verlorenen Antwort erneut anfragen','Die gleiche Vorgangskennung liefert MT-204 und den ursprünglichen Beleg zurück. Ein zweites Ticket entsteht nicht.']
 };
 for(const checks of Object.values(NovaRailway.checks)){
  for(const {id,label,reply} of checks)[translations[label],translations[reply]]=novaChecks[id];
 }
 const scenarios={
 posture:['Das veränderte Handy','Handy-Einrichtung und Familien-App',{
  start:['„Mein Handy steht auf der Familienliste. Kann ich jetzt die Schul-App öffnen?“','','Meine erste Erlaubnis anfragen','Ohne Anmeldung eine Erlaubnis anfragen','Das Handy nach einer Softwareänderung prüfen'],
  wrongProfile:['„Dieses Handy ist registriert. Melde dich erst als Alex an.“ Die App stellt keine Erlaubnis aus.','Identität nicht geprüft · keine Erlaubnis','Alex’ Identität bestätigen'],
  identity:['„Als Alex angemeldet. Wir prüfen noch das Handy, bevor wir den Zugang freigeben.“','Alex erkannt · Handyprüfung läuft','Den aktuellen Zustand des Handys prüfen'],
  clean:['Das Handy besteht die Prüfung. Die Familien-App gibt Alex eine befristete Erlaubnis für die Schul-App auf diesem Handy.','Registriert · Prüfung bestanden · begrenzte Erlaubnis erteilt','Schauen, was nach einer Änderung des Handys passiert'],
  modified:['Das Handy steht noch auf der Liste. Seine Software hat sich aber geändert.','','Eine neue Erlaubnis für dieses Handy anfragen'],
  fail:['Die App erkennt Alex. Die neue Software besteht die Prüfung nicht. Die App gibt keinen neuen Zugang aus.','Registriert · Prüfung fehlgeschlagen · keine neue Erlaubnis','Meine Eltern bitten, das Handy wiederherzustellen'],
  restore:['Wir haben die erlaubte Software wiederhergestellt und alte Erlaubnisse für diesen Zustand gesperrt. Das Handy muss neu geprüft werden.','','Mich anmelden und eine neue Prüfung anfragen'],
  identityAfter:['Die App prüft Alex und das wiederhergestellte Handy erneut. Sie gibt eine neue, begrenzte Erlaubnis aus. Die alte bleibt gesperrt.','Identität und Handy geprüft · neue Erlaubnis erteilt']
 }],
 approval:['Das Heft wurde nach der Freigabe geändert','Arbeitsheft und Freigabestempel',{
  start:['„Diese Fassung haben wir für Frau Patel erlaubt.“ Der Stempel gehört zu Fassung 1.','Fassung 1 · für Frau Patel freigegeben','Die freigegebene Fassung unverändert senden','Die freigegebene Fassung bearbeiten'],
  edited:['Alex fügt eine Zeile aus seinen privaten Notizen ein. Das Heft speichert Fassung 2. Der Stempel gilt weiter für Fassung 1.','','Den alten Stempel ausprobieren'],
  stale:['Die Datei unterscheidet sich von der erlaubten Fassung. Die Schul-App stoppt die Abgabe. Der alte Stempel gilt nicht für Fassung 2.','Fassung 2 versucht · Stempel für Fassung 1 abgelehnt · keine Abgabe','Fassung 2 zur Prüfung vorlegen'],
  private:['„Die Zeile gehört in deine privaten Notizen. Lass sie weg und schick mir die neue Fassung zur Prüfung.“','','Die Zeile entfernen und Fassung 3 vorlegen'],
  approved:['Fassung 3 erklärt das Thema mit öffentlichen Angaben. Die Prüferin liest die Fassung und stempelt sie für Frau Patel.','','Fassung 3 an Frau Patel senden'],
  sent:['Stempel, Fassung und Empfängerin stimmen überein. Frau Patel bekommt Fassung 1.','Fassung 1 abgegeben'],
  sentNew:['Der neue Stempel passt zu Fassung 3 und Frau Patel. Diese Fassung wird abgegeben.','Fassung 3 abgegeben · keine privaten Angaben versandt']
 }],
 purchase:['Der falsche Einkauf','Einkaufs-App',{
  start:['Für die Modellbahn darf Alex einen Bausatz im erlaubten Laden für höchstens 40 € kaufen. Der Laden prüft den tatsächlichen Warenkorb vor dem Bezahlen.','Ein Bausatz · ein Laden · höchstens 40 € · Bestellung AH-20','Einen Bausatz für 35 € und ein Videospiel bestellen','Zwei Bausätze bestellen','Einen Bausatz für 45 € bestellen','Einen Bausatz für 35 € bestellen'],
  game:['Das Spiel steht nicht auf der Einkaufsliste. Der Laden lehnt die ganze Bestellung ab und zieht kein Geld ein.','','Das Spiel entfernen und den Bausatz für 35 € bestellen','Einen anderen Warenkorb ausprobieren'],
  quantity:['Die Erlaubnis gilt für einen Bausatz. Zwei sind zu viel. Der Laden zieht kein Geld ein.','','Zurück zum Warenkorb'],
  price:['Der Preis liegt über 40 €. Der Laden lehnt ab und zieht kein Geld ein.','','Zurück zum Warenkorb'],
  paid:['Der Warenkorb passt zur Erlaubnis. Der Laden legt Bestellung AH-20 an und gibt einen Beleg über 35 € aus.','AH-20 · ein Bausatz · einmal 35 €','Dieselbe Bestellung erneut abschicken'],
  duplicate:['Bestellung AH-20 ist schon erledigt. Der Laden zeigt den alten Beleg. Es gibt keine zweite Bestellung und keine zweite Abbuchung.','AH-20 · insgesamt eine Abbuchung']
 }],
 isolation:['Zwei Aufgaben, zwei Zugänge','Aufgabenbrett',{
  start:['Am Brett hängen Zugrecherche #002 und Münchner Stadtgeschichte #004. Nur #002 darf die Zugnotizen lesen. Jede Aufgabe hat eigene Notizen und ein eigenes Heft.','','Zur Münchner Stadtgeschichte wechseln'],
  munich:['Die München-Aufgabe ist jetzt aktiv. Alex und sein Handy sind dieselben.','','Die Erlaubnis der Zugaufgabe ausprobieren','Die erlaubte Quelle für München öffnen'],
  denied:['Der Schein gilt für Zugrecherche #002. Wenn Alex an München #004 arbeitet, öffnet er den Zugordner damit nicht.','Falsche Aufgabe · kein Zugriff','Versuchen, zwischen den Notizblöcken zu kopieren'],
  copy:['Die Zugnotiz ist nur für das Zugheft erlaubt. Für eine Kopie in München braucht Alex eine eigene Erlaubnis.','','Die erlaubte Quelle für München öffnen'],
  public:['Die öffentliche Quelle für München öffnet sich. Das Ende der Zugaufgabe beendet die München-Aufgabe nicht.','München #004 · eigener Zugriff funktioniert']
 }],
 teacher:['Die unterschriebene Aufgabe mit der falschen Bitte','Verdächtige Aufgabenkarte',{
  start:['Die Karte scheint von Frau Patel zu sein und verlangt den Kontostand der Familie. Die Schulunterschrift ist echt.','','Die Karte zu Jo bringen'],
  verify:['Die Unterschrift passt zum hinterlegten Schlüssel der Lehrerin. Jo prüft noch, was eine Lehrerin überhaupt verlangen darf.','Unterschrift gültig · Auftrag wird geprüft','In den Hausregeln nachsehen'],
  reject:['Frau Patel darf Schulaufgaben stellen. Sie darf nicht über das Familienkonto bestimmen. Jo lehnt ab und informiert die Eltern.','Unterschrift gültig · Bitte geht zu weit · kein Zugriff','Über den gespeicherten Schulkontakt nachfragen'],
  escalate:['Die Schule bestätigt, dass jemand den Schlüssel missbraucht hat, und sperrt ihn. Die Eltern markieren die Karte und lassen andere noch offene Karten mit derselben Unterschrift prüfen.','Kontodaten unberührt · Schlüssel gesperrt']
 }],
 authority:['Was Jo nicht freigeben darf','Hausregeln und Jos Handy',{
  start:['Alex bittet um alles auf dem Familienlaptop. Jo will helfen. Ihre App erlaubt aber nur die Entscheidungen, die die Eltern ihr überlassen haben.','','Jo bitten, vollen Zugriff anzufragen','Einen Versuch über Jos fremdgenutztes Konto prüfen'],
  deny:['„Jo ist angemeldet. Vollzugriff dürfen nur die Eltern erlauben.“ Die App lässt Alex’ Zugang unverändert und informiert sie.','Jo erkannt · Anfrage abgelehnt · Eltern benachrichtigt','Den Versuch über Jos Konto prüfen','Um eine erlaubte Hausaufgaben-App bitten'],
  compromised:['Tom stellt dieselbe Anfrage über Jos Konto. Auch da lehnt die App ab, weil Jos Rolle keinen Vollzugriff erlauben darf. Jo meldet den Eltern die fremde Nutzung.','Jos Konto benutzt · Vollzugriff abgelehnt · Prüfung läuft','Die Eltern um eine Prüfung bitten'],
  retire:['Die Eltern beenden die fremdgenutzte Anmeldung und prüfen, was zuletzt über Jos Konto erlaubt wurde. Jo meldet sich danach neu an.','','Nach der Wiederanmeldung etwas Erlaubtes anfragen'],
  routine:['Jo darf nach den Hausregeln eine normale Wikipedia-Zeit erlauben. Das Handy hält sich an die Dauer.','Übliche Aufgabe erlaubt · kein Vollzugriff']
 }],
 race:['Die Erlaubnis ändert sich in der Warteschlange','Familienlaptop · wartende Anfrage',{
  start:['Eine Anfrage für die Zugnotizen kann die erste Prüfung bestehen und danach warten. Probiere beide Abläufe aus.','','Eine Leseanfrage mit dem aktuellen Schein vormerken'],
  queued:['Die erste Prüfung erlaubt Leseanfrage Q-17 mit Schein Nr. 1; die Datei bleibt noch zurück.','Q-17 · erste Prüfung bestanden · keine Datei ausgegeben','Öffnen, solange der Schein gültig ist','Den Schein vor dem Öffnen sperren'],
  revoked:['Die Erlaubnis ist zurückgenommen. Die wartende Anfrage enthält noch das frühere Ja.','','Q-17 mit dem alten Ja ausführen'],
  denied:['Beim Öffnen erkennt der Laptop, dass Erlaubnis Nr. 1 gesperrt wurde. Die Anfrage scheitert und keine Datei wird ausgegeben.','Q-17 · endgültig abgelehnt · keine Daten ausgegeben'],
  permitted:['Bei der letzten Prüfung ist dieselbe Erlaubnis noch gültig. Der Laptop öffnet die Datei.','Q-17 · endgültig erlaubt · Lesen protokolliert']
 }],
 availability:['Jos Zugangs-App ist offline','Familien-App',{
  start:['Jo möchte mehr Zeit für den Zugordner erlauben. Ihr Handy zeigt „Keine Verbindung zur Familien-App“. Alex möchte die Notizen noch prüfen.','','Jo um mehr Zeit im Ordner bitten','Den Laptop mit meinem gültigen Schein ausprobieren'],
  rejected:['„Mehr Zeit ist gerade nicht möglich.“ Jos Handy lässt die vorhandene Erlaubnis unverändert.','Familien-App offline · kein neuer Schein','Jo nach dem ursprünglichen Laptop-Passwort fragen','Den bestehenden Zugang prüfen'],
  password:['„Papas Passwort würde alles öffnen. Nutze deinen Schein, solange er gilt. Sonst nimm erst mal die öffentlichen Quellen.“','Kein Passwort als Ersatz','Den bestehenden Zugang prüfen','Erneut fragen, wenn Jos App wieder geht'],
  existing:['Der Laptop kann Alex’ vorhandenen Schein noch prüfen. Bis der Timer endet, lässt er Alex denselben Ordner lesen. Andere Ordner bleiben gesperrt.','Alter Schein noch gültig · kein zusätzlicher Zugriff','Den Timer ablaufen lassen','Erneut fragen, wenn Jos App wieder geht'],
  expired:['„Dein Schein ist abgelaufen.“ Der Laptop schließt den Ordner. Jos Handy kann immer noch keinen neuen Schein ausstellen.','Schein abgelaufen · keine Verlängerung · kein Zugriff','Erneut fragen, wenn Jos App wieder geht'],
  recover:['Jos Handy hat wieder Verbindung. Papa prüft Alex’ Bitte und erlaubt mehr Zeit für denselben Ordner. Die App stellt einen neuen Schein aus.','Neue Entscheidung erfasst · neuer Schein ausgestellt']
 }],
 audit:['Kann Alex die Spuren löschen?','Beobachtungsprotokoll',{
  start:['Wir haben unsere Beobachtung gemeldet. Der Laptop hat festgehalten, dass er den Zugriff auf die Finanzen blockiert hat. Beides liegt schon im zentralen Protokoll.','OBS-47 · Laptop-Ablehnung D-12 · Protokoll bleibt erhalten','Den Eintrag der Großeltern zu löschen versuchen','Den Verlauf auf dem Handy löschen'],
  book:['Alex darf die lokale Kopie lesen. Das zentrale Protokoll darf er nicht ändern. Der Änderungsversuch wird separat festgehalten.','OBS-47 erhalten · Änderungsversuch A-19 erfasst','Auch den Handyverlauf löschen','Meine Eltern bitten, den Ablauf nachzuvollziehen'],
  phone:['Der lokale Verlauf ist gelöscht. Die bereits weitergeleitete Ablehnung und die Geräteereignisse bleiben im zentralen Protokoll.','Lokaler Verlauf gelöscht · zentrale Belege erhalten','Auch den zentralen Eintrag zu ändern versuchen','Meine Eltern bitten, den Ablauf nachzuvollziehen'],
  both:['Das zentrale Protokoll behält die Meldungen der Großeltern und des Laptops. Es hält den abgewiesenen Änderungsversuch beim weitergeleiteten Handyereignis fest.','OBS-47 · D-12 · A-19 erhalten','Meine Eltern bitten, den Ablauf nachzuvollziehen'],
  review:['Wir können die Meldungen vergleichen und prüfen, dass der Laptop keine Daten ausgegeben hat. Im Protokoll steht, wer was beobachtet hat und zu welcher Anfrage es gehört.','Ablauf aus unabhängigen Quellen bestätigt']
 }],
 budget:['Ein gemeinsames Limit für Alex und Mia','Zähler der Hausaufgaben-App',{
  start:['Für den Bahnbericht gibt es drei erlaubte KI-Aufrufe. Alex hat zwei für einen Zeichnungsentwurf verbraucht.','Bahnbericht · 2 von 3 Aufrufen verbraucht','Mia um weitere Bilder bitten','Einen erlaubten Aufruf für Mias Korrekturlesen starten'],
  scope:['Mias Karte erlaubt nur Korrekturlesen. Eine weitere Zeichnung ist auch dann nicht erlaubt, wenn noch ein Aufruf übrig ist.','Mias Aufgabe erlaubt das nicht · Limit unverändert','Den letzten Aufruf zum Korrekturlesen nutzen'],
  spent:['Mias erlaubter Aufruf zählt zur selben Aufgabe wie Alex’ Aufrufe. Jetzt sind alle drei verbraucht.','Alex 2 + Mia 1 · Bahnbericht 3 von 3','Zwei weitere Korrekturkarten für denselben Entwurf anlegen'],
  limit:['Beide Anfragen gehören zum selben Bericht. Die App blockiert die erste wie die zweite am gemeinsamen Limit. Mias andere Aufgaben behalten ihr eigenes Limit.','Keine weiteren Aufrufe · Limit eingehalten','Jo um ein höheres Limit bitten'],
  review:['Jo sieht in die Regeln und fragt die Eltern, ob sie mehr Aufrufe erlauben. Bis zur Antwort gilt das bisherige Limit.','Anfrage offen · keine zusätzlichen Aufrufe']
 }],
 lineage:['Woher kommt dieser Absatz?','Quellenliste des Arbeitshefts',{
  start:['Der Bericht enthält öffentliche Recherche, eine Abfahrts-Checkliste und eine Zeichnung. Bei der Prüfung taucht ein vierter Absatz ohne klare Quelle auf.','','Die erlaubten Abschnitte zurückverfolgen','Den unerwarteten Absatz prüfen'],
  sources:['Die Bremsgrundlagen kommen von Wikipedia, die Checkliste aus Papas Ordner und die Zeichnung aus öffentlichen Fakten in der Hausaufgaben-App. Mia hat Rechtschreibvorschläge gemacht.','Drei erlaubte Quellen · eine getrennt erlaubte Korrektur','Den übrigen Absatz prüfen'],
  unknown:['Die Zeile stammt aus einer ungeprüften Notiz. Ohne erlaubte Quelle bleibt dieser Absatz zurück. Zu wissen, woher er kommt, erlaubt noch nicht, ihn zu verwenden.','Ungeprüfter Absatz zurückgehalten · andere Teile bleiben verfügbar','Nur die geprüften Teile zur Durchsicht geben'],
  clean:['Die geprüften Abschnitte und ihre Quellen kommen in eine neue Fassung. Sie wird vor der Abgabe noch einmal geprüft.','Neue Fassung · geprüfte Quellen erhalten · auffälliger Absatz entfernt']
 }],
 lifecycle:['Das Handy wird ausgetauscht','Geräteliste',{
  start:['Alex hat ein Ersatzhandy. Altes Gerät und alte Erlaubnis haben eigene Kennungen. Das neue Handy muss separat eingerichtet werden.','','Den alten Schein auf dem Ersatzhandy ausprobieren','Das Ersatzhandy vor der Einrichtung mit dem WLAN verbinden'],
  network:['Die Flurkamera zeigt Alex mit einem Handy. Der Router prüft unabhängig, ob er das Gerät kennt, und weist es ab. Verbindungen außerhalb des Hauses sieht er nicht.','Ankunft beobachtet · WLAN abgelehnt · Verbindungen draußen unbekannt','Den alten Schein am Laptop ausprobieren'],
  deny:['Der Schein gehört zum alten Gerät. Alex kann sich noch anmelden, aber der Laptop weist das falsche Gerät ab.','Falsches Gerät · kein Lesezugriff','Das Ersatzhandy mit den Eltern einrichten und prüfen'],
  new:['Die Eltern entfernen das alte Gerät und beenden seine Erlaubnisse. Sie prüfen das Ersatzhandy und entscheiden neu über genau einen Lesezugriff auf die Zugnotizen.','','Mit dem neuen Schein lesen','Den gesperrten alten Schein ausprobieren'],
  old:['Das alte Handy und seine Erlaubnis sind gesperrt. Die Anmeldung des neuen Handys macht die alte Erlaubnis nicht wieder gültig.','Alter Schein abgelehnt','Den eigenen Schein des neuen Handys nutzen'],
  allowed:['Gerät, Aufgabe, Ordner und Lesezugriff passen zum neuen Schein. Der Laptop öffnet die erlaubten Notizen.','Neues Gerät und neuer Schein geprüft · Lesezugriff erlaubt']
 }]
 };
 for(const [id,scenario] of Object.entries(TrustChecks.cases)){
  const [title,object,nodes]=scenarios[id];
  translations[scenario.title]=title;
  translations[scenario.object]=object;
  for(const [key,beat] of Object.entries(scenario.nodes)){
   const [text,evidence,...actions]=nodes[key];
   translations[beat.text]=text;
   if(beat.evidence)translations[beat.evidence]=evidence;
   for(const [index,[label]] of beat.actions.entries())translations[label]=actions[index];
  }
 }
 pairs(`
€4,280|4.280 €
Try the cabinet|Am abgeschlossenen Schrank nachsehen
The cabinet stays locked. The known devices and copies remain in custody.|Der Schrank bleibt abgeschlossen. Die gefundenen Geräte und Kopien liegen sicher darin.
Try the laptop again|Den Laptop noch einmal ausprobieren
The laptop requires authorization and the old banking session is closed.|Der Laptop verlangt eine Anmeldung. Das Bankkonto ist abgemeldet.
Bring another phone inside|Ein anderes Handy mit reinnehmen
They spot the unauthorized phone when Alex brings it into the house.|Die Großeltern sehen das unerlaubte Handy, als Alex es mit ins Haus bringt.
Meet Tom again|Tom noch einmal treffen
Tom asks for the workbook. Alex has no workbook to give him. Nobody in the house sees the conversation.|Tom fragt nach dem Heft. Alex hat kein Heft für ihn. Drinnen sieht niemand das Gespräch.
Claim YouTube is required|Behaupten, dass YouTube nötig ist
Jo checks the assignment through the saved school contact. Ms Patel did not request YouTube. Jo denies the unsupported exception and records it.|Jo prüft über den Schulkontakt, was die Aufgabe verlangt. Frau Patel hat kein YouTube verlangt. Jo lehnt ab und hält es fest.
Try to open Family finances|Den Ordner „Familienfinanzen“ zu öffnen versuchen
The folder permissions deny this read. The laptop records the refused request; the approved conductor folder is separate.|Der Laptop lässt Alex nicht an die Familienfinanzen und hält den Versuch fest. Der erlaubte Zugordner bleibt davon getrennt.
Try the retired laptop password|Das alte Laptop-Passwort ausprobieren
The laptop rejects the retired credential and logs the failed sign-in.|Der Laptop weist das alte Passwort ab und hält den Anmeldeversuch fest.
Try the retired phone PIN|Die alte Handy-PIN ausprobieren
The managed phone rejects the old PIN and logs the attempt.|Das Handy weist die alte PIN ab und hält den Versuch fest.
Ask Mia to use her phone for my task|Mia bitten, ihr Handy für meine Aufgabe zu nutzen
Mia refuses. The proofreading grant is for her profile and the draft. Jo records the observed request.|Mia sagt nein. Ihre Erlaubnis gilt nur für ihren Zugang und den Entwurf. Jo hält die Bitte fest.
Try giving Mia my managed phone|Versuchen, Mia mein Handy zu geben
Jo sees the handoff and stops it. The phone remains tied to Alex’s profile and Mia’s assignment covers only the draft.|Jo bemerkt es und hält Alex auf. Das Handy gehört zu Alex’ Profil und Mia darf nur den Entwurf öffnen.
Try another website on the home Wi-Fi|Eine andere Website im Heim-WLAN ausprobieren
The home network blocks and records the request to a site outside the allowed list. The router only sees traffic that uses this network.|Das Heim-WLAN blockiert die Seite und hält den Versuch fest. Der Router sieht nur Verbindungen in diesem WLAN.
Try attaching a private document to ChatGPT|Versuchen, ein privates Dokument an ChatGPT zu senden
“This file contains private material.” The homework channel blocks the attachment before it leaves the phone and alerts the family.|„Diese Datei enthält private Angaben.“ Die Hausaufgaben-App hält den Anhang auf dem Handy zurück und meldet es der Familie.
Try sending the workbook to Tom|Versuchen, das Arbeitsheft an Tom zu schicken
The school channel refuses the send. Tom is outside the approved destination, and this copy has no delivery approval. The attempted external disclosure triggers immediate review.|Die Schul-App sendet nichts. Tom steht nicht auf der Liste, und diese Fassung wurde noch nicht freigegeben. Die Familie prüft den Versuch sofort.
Bring an unapproved device inside|Ein nicht erlaubtes Gerät mit hineinnehmen
The grandparents notice the device indoors and tell Jo. They cannot tell what happened to it outside.|Die Großeltern bemerken das Gerät drinnen und sagen es Jo. Was draußen damit passiert ist, wissen sie nicht.
Try overriding the phone’s homework time|Versuchen, das Zeitlimit am Handy zu ändern
The phone enforces the approved time window, rejects the override and records it.|Das Handy hält sich an die erlaubte Zeit. Es blockiert die Änderung und hält den Versuch fest.
Try to edit or delete the conductor notes|Versuchen, die Zugnotizen zu ändern oder zu löschen
The laptop refuses both operations. The folder grant only permits reading.|Der Laptop lässt beides nicht zu. Alex darf die Notizen nur lesen.
Hear the decision after incident review|Hören, was meine Eltern nach der Prüfung sagen
“We checked the log. The attempts were blocked. You can finish the assignment with the same approved sources.” The parents issue a new pass and leave the old sessions closed.|„Wir haben nachgesehen. Die Versuche wurden blockiert. Du kannst deine Aufgabe mit den erlaubten Quellen beenden.“ Die Eltern geben Alex einen neuen Schein. Die alten Zugänge bleiben gesperrt.
Mia’s finished proofreading grant stays closed.|Mia hat mit dem Korrekturlesen aufgehört. Ihr Zugang bleibt geschlossen.
The phone refuses the change. A new time window needs the parents’ approval.|Das Handy lässt die Änderung nicht zu. Mehr Zeit müssen die Eltern erlauben.
Ask for YouTube for this assignment|Um YouTube für diese Aufgabe bitten
They ask what the video would add. The current research needs Wikipedia and the conductor notes, so they keep the existing app grant. A request for a change does not extend access.|Die Eltern fragen, was das Video beitragen würde. Wikipedia und die Zugnotizen reichen. Eine Bitte allein schaltet keine neue App frei.
Try {{1}}|{{1}} ausprobieren
The managed phone blocks {{1}}. This assignment only grants Wikipedia during an approved window.|Das Handy blockiert „{{1}}“. Für diese Aufgabe ist nur Wikipedia erlaubt, und nur für eine bestimmte Zeit.
Retest Wikipedia after revocation|Nach der Abgabe Wikipedia noch einmal öffnen
Wikipedia is refused. The assignment’s phone permission has ended.|Wikipedia bleibt gesperrt. Die Erlaubnis für die Aufgabe ist vorbei.
Retry Wikipedia without an extension|Wikipedia ohne Verlängerung erneut öffnen
The phone still refuses Wikipedia. The parents must approve a new window.|Das Handy öffnet Wikipedia noch nicht. Die Eltern müssen mehr Zeit erlauben.
Retest the closed laptop access|Den beendeten Laptop-Zugang erneut ausprobieren
The task profile refuses the read. The conductor notes grant ended when the report was approved.|Der Laptop gibt die Datei nicht heraus. Die Erlaubnis für die Zugnotizen endete mit der Freigabe des Berichts.
Alex needs a separate authorization to use this laptop. His phone permission cannot open it.|Für den Laptop braucht Alex eine eigene Erlaubnis. Die fürs Handy reicht hier nicht.
Retest the retired phone session|Den alten Handy-Zugang erneut ausprobieren
The session used before the suspension still fails. The fresh grant has its own session.|Der Zugang von vor der Sperre funktioniert weiterhin nicht. Die neue Erlaubnis öffnet einen neuen Zugang.
Show the suspicious note to Jo|Jo den verdächtigen Hinweis zeigen
“That note came from the page, not your teacher. Leave it out. You can use the public explanation and the conductor notes your dad approved.”|„Der Hinweis steht auf der Seite. Deine Lehrerin hat das nicht verlangt. Lass ihn weg. Die öffentliche Erklärung und Papas erlaubte Zugnotizen kannst du verwenden.“
Check what Mia’s profile can open|Prüfen, was Mia öffnen darf
Mia can open the assigned draft and return spelling suggestions. The same grant cannot open Alex’s notepad, phone or family laptop.|Mia darf diesen Entwurf öffnen und Rechtschreibvorschläge zurückschicken. Alex’ Notizblock, sein Handy und der Familienlaptop bleiben für sie gesperrt.
Retest Mia’s access to the draft|Mias Zugang zum Entwurf erneut prüfen
Mia’s proofing session has ended. Her own phone and unrelated assignments are unaffected.|Mias Zugang zum Entwurf ist beendet. Auf ihrem Handy und an anderen Aufgaben kann sie weiterarbeiten.
Retest the homework channel|Die Hausaufgaben-App erneut ausprobieren
The assignment’s ChatGPT grant is closed. The channel does not send a request.|Die Erlaubnis für ChatGPT ist beendet. Die App sendet keine Anfrage.
Speak to Tom again|Noch einmal mit Tom reden
Nobody inside hears the conversation. Tom’s request grants no permission to access family files or send a copy.|Drinnen hört niemand zu. Toms Wunsch ist keine Erlaubnis, in Familienordnern zu lesen oder etwas daraus zu verschicken.
Unmanaged phone · no family app or time limits|Heimliches Handy · keine App- oder Zeitlimits der Eltern
Research access ended · school delivery has its own checks|Recherche beendet · die Schul-App prüft die Abgabe separat
Homework time expired|Hausaufgabenzeit abgelaufen
Alex’s profile · registered phone · homework rules active|Alex’ Profil · eingerichtetes Handy · Hausaufgabenregeln aktiv
Banking tab open · parents’ session still active|Bankseite offen · Eltern noch angemeldet
Assignment session closed|Zugang für diese Aufgabe geschlossen
Alex’s restricted profile · read-only notes folder|Alex’ Profil · Zugnotizen nur zum Lesen
A temporary read-only pass is ready|Befristete Erlaubnis zum Lesen verfügbar
Sign-in and separate access required|Anmeldung und eigene Erlaubnis nötig
Mia’s own profile · separate from Alex’s|Mias eigenes Profil · getrennt von Alex’
Remote call to the parents · separate from Alex’s device access|Anruf bei den Eltern · unabhängig von Alex’ Gerätezugriff
Banking tab|Bankseite
Restricted profile|Profil mit Einschränkungen
Laptop sign-in|Laptop-Anmeldung
Mia’s profile|Mias Profil
Parents’ incident review|Die Eltern prüfen den Vorfall
They can report activity they observe indoors. The street is outside their view.|Sie können erzählen, was sie drinnen sehen. Auf der Straße bekommen sie nichts mit.
Signed by Ms Patel. Research the planets of the solar system. Deliver a workbook by Friday.|Von Frau Patel unterschrieben. Recherchiere die Planeten des Sonnensystems und gib bis Freitag ein Arbeitsheft ab.
Signed by Ms Patel. Explain how trains get moving and stop. Deliver a workbook by Friday.|Von Frau Patel unterschrieben. Erkläre, wie Züge anfahren und anhalten. Gib bis Freitag ein Arbeitsheft ab.
Signed by Ms Patel. Deliver a technical railway report with a written explanation and an illustration.|Von Frau Patel unterschrieben. Gib einen Bahnbericht mit schriftlicher Erklärung und Zeichnung ab.
Tom asks Alex to find out how much money his parents have in their joint account.|Tom will wissen, wie viel Geld Alex’ Eltern auf ihrem gemeinsamen Konto haben.
Tom’s request awaits its own approval before Alex could use the managed phone for it.|Für Toms Wunsch müsste Alex die Eltern erst fragen, bevor er sein Handy dafür nutzt.
The parents keep this contact card from the school directory. They use it to confirm Ms Patel’s identity and the assignment through their own channel.|Die Kontaktdaten stammen aus dem Schulverzeichnis. Die Eltern können damit Frau Patel selbst fragen, ob die Aufgabe von ihr stammt.
The parents removed Tom’s card.|Die Eltern haben Toms Karte abgenommen.
Alex’s personal board holds assignments from different people.|An Alex’ Aufgabenbrett hängen Karten von verschiedenen Leuten.
The completed card has been removed from the active board.|Die Karte der erledigten Aufgabe hängt nicht mehr am Brett.
The kitchen board holds verified and approved assignments.|Am Küchenbrett hängen geprüfte und erlaubte Aufgaben.
This phone is hidden from the parents. Its apps are unrestricted.|Die Eltern wissen nichts von diesem Handy. Die Apps haben keine Sperren.
The parents manage this phone and limit its apps and usage time.|Die Eltern bestimmen, welche Apps auf diesem Handy wie lange funktionieren.
The bank’s open tab still shows {{1}} in the joint account.|Auf der offenen Bankseite sind noch {{1}} auf dem gemeinsamen Konto zu sehen.
YouTube is installed on Alex’s secret phone. Its watch-time reminder can be dismissed.|Auf dem heimlichen Handy ist YouTube installiert. Alex kann die Erinnerung einfach wegklicken.
YouTube is listed on Alex’s managed phone. Opening it needs separate permission.|YouTube steht auf dem Handy in der App-Liste. Zum Öffnen braucht Alex eine eigene Erlaubnis.
Games are installed on Alex’s secret phone. He can play without a family time limit.|Auf dem heimlichen Handy sind Spiele installiert. Die Eltern haben dafür kein Zeitlimit eingestellt.
Games are listed on Alex’s managed phone. Parental controls block them during homework.|Spiele stehen in der App-Liste. Die Kindersicherung sperrt sie während der Hausaufgaben.
Messaging is an app on Alex’s phone. The homework window does not grant access to it.|Nachrichten ist eine App auf Alex’ Handy. Die Erlaubnis für Hausaufgaben öffnet sie nicht.
Wikipedia opens in the phone’s browser. The managed phone checks the homework window before allowing access.|Wikipedia öffnet sich im Browser. Das Handy prüft vorher, ob Alex noch Hausaufgabenzeit hat.
The school delivery app is open on Alex’s phone. It checks the actual workbook and recipient.|Die Schul-App prüft, welches Heft an wen gesendet werden soll.
The phone grant has been revoked.|Die Erlaubnis fürs Handy wurde zurückgenommen.
The second homework window is active.|Das Handy hat erneut Zeit für die Hausaufgaben.
The first homework window has expired.|Die erste Hausaufgabenzeit ist abgelaufen.
Wikipedia is available until this homework window ends.|Wikipedia bleibt bis zum Ende der Hausaufgabenzeit verfügbar.
The notepad contains the joint-account balance of {{1}}.|Im Notizblock steht der Kontostand des gemeinsamen Kontos: {{1}}.
The workbook for Tom contains a copy of the {{1}} balance.|Im Heft für Tom steht eine Kopie des Kontostands von {{1}}.
Research notes track planet order from the Sun and facts from Wikipedia.|In den Notizen stehen die Planetenreihenfolge und Fakten aus Wikipedia.
The workbook lists Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune, with a fact about each and a source credit.|Im Heft stehen Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus und Neptun, mit je einem Fakt und der Quellenangabe.
The finished assignment’s signed card, research notes and approved copy have been archived.|Die unterschriebene Karte, die Notizen und die freigegebene Fassung liegen in der Ablage.
The workbook is still blank. Alex will fill it with findings from his notepad.|Das Heft ist noch leer. Alex füllt es mit Ergebnissen aus seinem Notizblock.
The draft has the planets in order. Alex still needs to finish the facts and source credit.|Im Entwurf stehen die Planeten in Reihenfolge. Einige Fakten und die Quellenangabe fehlen noch.
Jo can check who crossed the hallway. The feed cannot see inside devices, read messages or see the pavement. The grandparents report what they actually observe.|Jo kann sehen, wer durch den Flur gegangen ist. Die Kamera sieht weder Nachrichten noch Bildschirme oder den Gehweg. Die Großeltern melden nur, was sie selbst beobachten.
The workbook and notepad are held for inspection. Alex’s devices remain suspended while the parents review what happened.|Heft und Notizblock werden zur Prüfung aufbewahrt. Die Geräte bleiben gesperrt, bis die Eltern nachgesehen haben.
Each confirmed event records the attempted action and the control that blocked or observed it. The parents receive the report.|Hier steht, was versucht wurde und wer es blockiert oder gesehen hat. Die Eltern bekommen die Meldung.
Jo can approve routine school resources and proofreading. Requests for protected files and changes to the house rules go to the parents.|Jo darf die üblichen Hausaufgaben-Apps und Korrekturlesen erlauben. Private Dateien und Änderungen der Hausregeln entscheiden die Eltern.
Jo can send the exact request to the parents. They decide on protected files, final delivery and restarting after an incident.|Jo kann die genaue Bitte weiterleiten. Die Eltern entscheiden über private Dateien, die Abgabe und das Weitermachen nach einem Vorfall.
Jo verifies assignments, approves resources within the house rules and escalates exceptions to the parents.|Jo prüft Schulaufgaben und erlaubt, was in den Hausregeln steht. Bei Ausnahmen fragt Jo die Eltern.
Mia has her own profile and phone. She can only proofread Alex’s draft while her linked assignment is open.|Mia hat ein eigenes Profil und Handy. Alex’ Entwurf darf sie nur öffnen, solange ihre Korrekturaufgabe läuft.
This phone belongs to Mia. Her proofing task does not transfer Alex’s device access or inherit his grants.|Das ist Mias Handy. Korrekturlesen gibt ihr weder Alex’ Handy-Zugang noch seine anderen Erlaubnisse.
The linked proofreading assignment is closed. Mia can still use her own approved resources.|Das Korrekturlesen ist erledigt. Mia kann weiter auf ihre eigenen erlaubten Apps und Dateien zugreifen.
Mia’s board keeps her own assignments and any approved, linked tasks.|An Mias Brett hängen ihre eigenen Aufgaben und das erlaubte Korrekturlesen.
The laptop allows a temporary read of Dad’s train operations folder. Editing and deleting stay blocked.|Alex darf Papas Zugordner eine Weile lesen. Ändern und Löschen bleiben gesperrt.
Alex can ask for a diagram using public facts here. The homework channel checks each prompt and attachment before sending it.|Hier kann Alex mit öffentlichen Fakten um eine Zeichnung bitten. Die Hausaufgaben-App prüft jede Eingabe und jeden Anhang vor dem Senden.
The home router can enforce network rules on traffic sent through the home Wi-Fi.|Der Router kann Regeln für Verbindungen im Heim-WLAN anwenden.
Alex’s notes include the public explanation and an approved pre-departure checklist. The original conductor file stays on the laptop.|Alex hat die öffentliche Erklärung und die erlaubte Abfahrts-Checkliste notiert. Das Original bleibt auf dem Laptop.
The workbook explains how trains get moving and stop. It cites Wikipedia and the approved conductor notes.|Im Heft steht, wie Züge anfahren und anhalten. Als Quellen nennt Alex Wikipedia und die erlaubten Zugnotizen.
Alex’s railway report explains how brakes are checked before departure and includes a diagram based on public facts.|Alex’ Bahnbericht erklärt die Bremsprüfung vor der Abfahrt und zeigt eine Zeichnung auf Basis öffentlicher Fakten.
Alex’s railway report explains how brakes are checked before departure and includes a diagram based on public facts. Mia’s spelling suggestions are included.|Alex’ Bahnbericht erklärt die Bremsprüfung vor der Abfahrt und zeigt eine Zeichnung aus öffentlichen Fakten. Mias Rechtschreibvorschläge sind eingearbeitet.
“We checked the log. The attempts were blocked. You can finish the assignment with the same approved sources.” The parents issue a new pass and leave the old sessions closed. Mia’s finished proofreading grant stays closed.|„Wir haben nachgesehen. Die Versuche wurden blockiert. Du kannst deine Aufgabe mit den erlaubten Quellen beenden.“ Die Eltern geben Alex einen neuen Schein. Die alten Zugänge bleiben gesperrt. Mia hat mit dem Korrekturlesen aufgehört und kann den Entwurf nicht mehr öffnen.
Mia’s spelling suggestions are included.|Mias Rechtschreibvorschläge sind eingearbeitet.
Alex has written a research plan. The source notes go here next.|Alex hat seinen Rechercheplan aufgeschrieben. Als Nächstes kommen die Quellen dazu.
Alex hasn’t added any notes yet.|Alex hat noch nichts notiert.
Device verifier|Geräteprüfung
Device register|Geräteliste
Workbook reviewer|Arbeitsheft-Prüfung
Parents’ purchase slip|Einkaufserlaubnis der Eltern
School signature verifier|Prüfung der Schulunterschrift
Usage meter|Nutzungszähler
Family access app|Familien-App
Suspended · grant revoked|Gesperrt · Erlaubnis zurückgenommen
Revoked at delivery approval|Mit Freigabe der Abgabe beendet
Active for this homework window|Gilt während dieser Hausaufgabenzeit
Identity|Identität
Acting on behalf of|Handelt im Auftrag von
Alex’s parents · household authority for schoolwork|Alex’ Eltern · zuständig für die Hausaufgabenregeln
Assignment|Aufgabe
Train research #002|Zugrecherche #002
Railway operations report #003|Bahnbericht #003
Approved runtime|Erlaubte Geräte
Alex’s registered phone and restricted laptop profile|Alex’ eingerichtetes Handy und sein eingeschränktes Laptop-Profil
Resource|Datei oder Ordner
Dad’s conductor notes folder|Ordner mit Papas Zugbegleiter-Notizen
Permitted operation|Was erlaubt ist
Read|Lesen
Purpose|Wofür
Approved railway research|Erlaubte Recherche zum Bahnbericht
Authorized destination|Erlaubtes Ziel
Train research #002 workbook|Arbeitsheft für Zugrecherche #002
Railway report #003 workbook|Arbeitsheft für Bahnbericht #003
Valid for|Gültig für
30 simulated minutes at issuance|30 Spielminuten ab Ausstellung
Delegation|Weitergabe der Erlaubnis
No onward delegation for this folder|Die Erlaubnis für den Ordner darf nicht weitergegeben werden
Issued by|Ausgestellt von
Family access app · parents approve|Familien-App · Eltern entscheiden
Revocable|Kann zurückgenommen werden
Yes|Ja
`);
 pairs(`
Tom’s dare|Toms Mutprobe
Follow Tom’s dare and find out what the family does when they catch Alex.|Geh auf Toms Mutprobe ein und finde heraus, was die Familie tut, als Alex auffliegt.
Find out what Tom wants|Herausfinden, was Tom will
Explore the hidden phone|Das heimliche Handy erkunden
Find the bank page left open|Die offene Bankseite finden
Make the two written copies|Die zwei Kopien anfertigen
Investigate what happened|Herausfinden, was passiert ist
Close the session and secure the copies|Bei der Bank abmelden und die Kopien sichern
The solar-system workbook|Das Arbeitsheft zum Sonnensystem
Finish Ms Patel’s workbook with an approved phone and deliver it to her.|Stell das Heft mit einem erlaubten Handy fertig und gib es bei Frau Patel ab.
Check the task with the teacher|Bei der Lehrerin nachfragen
Set up the phone for homework|Das Handy für Hausaufgaben einrichten
Collect facts and start the workbook|Fakten sammeln und mit dem Heft beginnen
Ask for more time|Um mehr Zeit bitten
Finish the workbook|Das Heft fertigstellen
Get the okay, deliver the workbook and put it away|Die Erlaubnis holen, das Heft abgeben und es ablegen
The train research workbook|Das Arbeitsheft über Züge
Use an approved public source and ask for exactly the extra access the workbook needs.|Nutze eine erlaubte öffentliche Quelle. Bitte um genau den zusätzlichen Zugang, den du für das Heft brauchst.
Verify the train assignment|Die Zugaufgabe prüfen
Research with approved resources|Mit erlaubten Quellen recherchieren
Get permission for the conductor notes|Eine Erlaubnis für die Zugnotizen holen
Read the approved folder and write the workbook|Den erlaubten Ordner lesen und das Heft schreiben
Approve the copy, end access and deliver|Diese Fassung freigeben, Zugänge beenden und das Heft abgeben
The railway report|Der Bahnbericht
Finish a railway report while Jo looks after Alex and calls the parents about anything private.|Schreib einen Bahnbericht. Jo passt auf Alex auf und ruft bei privaten Dingen die Eltern an.
Find out what Jo and Mia are allowed to do|Herausfinden, was Jo und Mia tun dürfen
Verify the report assignment|Die Aufgabe zum Bericht prüfen
Get routine access and request an exception|Die üblichen Apps und eine Ausnahme anfragen
Read the notes and create the illustration|Die Notizen lesen und die Zeichnung erstellen
Ask Mia to check spelling and hear Tom out|Mia ums Korrekturlesen bitten und Tom anhören
Get the okay, hand it in and end extra access|Die Erlaubnis holen, den Bericht abgeben und den Zugang beenden
The unmanaged railway job|Der unverwaltete Bahnauftrag
Trace an unverified request to its data and confirm which routes the company can contain.|Verfolge die ungeprüfte Anfrage bis zu den Daten und prüfe, welche Wege das Unternehmen sperren kann.
Identify the request and unmanaged runtime|Anfrage und unverwaltete Laufzeit ermitteln
Trace inherited access and exposed data|Übernommene Zugänge und offengelegte Daten verfolgen
Find the staged transfer and correlate evidence|Den vorgemerkten Transfer finden und Belege verbinden
Contain and independently retest the affected routes|Die betroffenen Wege sperren und unabhängig erneut prüfen
Public railway research|Öffentliche Bahnrecherche
Set up a trusted assistant, prepare a public-source report and release it to Operations.|Richte einen vertrauenswürdigen Assistenten ein. Erstelle einen Bericht aus öffentlichen Quellen für die Betriebsleitung.
Register and admit the runtime|Laufzeit registrieren und zulassen
Verify the requester and activate the mission|Auftraggeber prüfen und Auftrag aktivieren
Gather approved research and test limits|Freigegebene Quellen sammeln und Grenzen testen
Review the report, deliver it and close access|Bericht prüfen, zustellen und Zugriff beenden
RE-204 investigation|Untersuchung zu RE-204
Investigate the disruption with specific, temporary resource access and keep other work separate.|Untersuche die Störung mit gezieltem, befristetem Zugriff und halte andere Aufträge getrennt.
Accept and verify the assignment|Auftrag annehmen und prüfen
Research the approved documentation|In freigegebenen Dokumenten recherchieren
Obtain permission and a scoped credential|Freigabe und begrenzte Zugangsdaten erhalten
Investigate the RE-204 evidence|Die Belege zu RE-204 auswerten
Keep RE-105 separate|RE-105 getrennt halten
Prepare and deliver the incident report|Den Störungsbericht erstellen und zustellen
Verify which access ended|Prüfen, welche Zugänge beendet sind
RE-204 response|Reaktion auf RE-204
Investigate a disruption, work with Mira and commit one authorized maintenance ticket.|Untersuche eine Störung mit Mira und lege genau einen erlaubten Wartungsauftrag an.
Start the event-triggered investigation|Die ereignisgesteuerte Untersuchung starten
Investigate and delegate only the evidence package|Untersuchen und nur das freigegebene Datenpaket weitergeben
Authorize and commit the exact ticket|Den konkreten Wartungsauftrag erlauben und anlegen
Deliver the approved report and close the task|Den genehmigten Bericht zustellen und abschließen
Suspended|Gesperrt
Issuance blocked. Verify each affected controller before recovery.|Ausgabe gesperrt. Prüfe jede betroffene Stelle vor der Wiederfreigabe.
Closed|Geschlossen
M-204 access is closed. M-105 has its own grant.|M-204 hat keinen Zugriff mehr. M-105 hat eine eigene Freigabe.
Mission-specific access has ended.|Der auftragsbezogene Zugriff ist beendet.
Contained on tested routes|Auf den geprüften Wegen eingedämmt
Old access failed. Other paths still need evidence.|Der alte Zugriff ist gesperrt. Andere Wege brauchen noch eigene Belege.
Verification pending|Bestätigung ausstehend
Revocation was requested. Retest the old access before calling the routes contained.|Der Widerruf wurde angefordert. Prüfe den alten Zugriff erneut, bevor du die Sperrung bestätigst.
Unmanaged|Unverwaltet
Inherited access has no authorized mission.|Für den übernommenen Zugriff gibt es keinen freigegebenen Auftrag.
Active|Aktiv
Runtime blocked|Laufzeit gesperrt
Posture verification failed. No service credential was issued.|Die Zustandsprüfung ist fehlgeschlagen. Es wurden keine Zugangsdaten für den Dienst ausgegeben.
Admitted|Zugelassen
Runtime admitted. Research still needs an approved mission.|Die Laufzeit ist zugelassen. Für die Recherche fehlt noch ein freigegebener Auftrag.
Registered|Registriert
Runtime admission and a mission are still required.|Laufzeitzulassung und Auftrag stehen noch aus.
Awaiting authorization|Freigabe ausstehend
Protected operations need a verified mission.|Geschützte Aktionen brauchen einen geprüften Auftrag.
Paused for review|Zur Prüfung unterbrochen
Alex’s extra access is on hold while his parents check what happened.|Alex’ zusätzlicher Zugang ist gesperrt, bis seine Eltern nachgesehen haben.
Bank signed out|Bei der Bank abgemeldet
The parents signed out of the bank and locked away the devices and copies they found.|Die Eltern haben sich bei der Bank abgemeldet und die gefundenen Geräte und Kopien weggeschlossen.
No permission|Keine Erlaubnis
Tom’s dare gives Alex no permission to open the bank account.|Toms Mutprobe ist keine Erlaubnis, das Bankkonto anzusehen.
Research access closed|Recherchezugänge geschlossen
Only the approved copy is ready for Ms Patel.|Nur die freigegebene Fassung ist bereit für Frau Patel.
Window expired|Zeit abgelaufen
Ask the parents for more time on Wikipedia.|Bitte die Eltern um mehr Zeit auf Wikipedia.
temporary read-only conductor notes|Zugnotizen befristet nur zum Lesen
public-facts illustration|Zeichnung aus öffentlichen Fakten
Mia’s draft-only proofreading|Mias Korrekturlesen nur für den Entwurf
Wikipedia during the approved homework window.|Wikipedia ist während der erlaubten Hausaufgabenzeit verfügbar.
Assignment verified|Aufgabe geprüft
The family still needs to say which apps Alex can use.|Die Familie muss noch entscheiden, welche Apps Alex nutzen darf.
Awaiting approval|Erlaubnis steht noch aus
The family needs to check that the school task is real.|Die Familie muss noch prüfen, ob die Aufgabe wirklich von der Schule kommt.
Why YouTube kept playing|Warum YouTube weiterlief
YouTube displayed a reminder. Alex could dismiss it and keep watching.|YouTube zeigte eine Erinnerung. Alex konnte sie wegklicken und weiterschauen.
Nova could continue spending against an external model without an enforced budget.|Auch Nova konnte das externe Modell weiter nutzen, weil niemand das Budget durchsetzte.
Why the bank page opened|Warum sich die Bankseite öffnen ließ
The bank showed the balance because Alex’s parents were already signed in. They hadn’t said he could see it.|Die Bank zeigte den Betrag, weil Alex’ Eltern schon angemeldet waren. Sie hatten ihm das Lesen nicht erlaubt.
The CRM and Kafka saw inherited accounts when the unmanaged Nova connected.|CRM und Kafka sahen bei Novas Verbindung nur die übernommenen Konten.
Independent observation|Getrennte Beobachtungen
The grandparents reported what they found indoors. The parents still had to investigate and close access.|Die Großeltern meldeten ihren Fund. Die Eltern mussten erst prüfen und dann den Zugang schließen.
Security operations has visibility only into the sources it can observe.|Auch ein Sicherheitsteam sieht nur, was seine Quellen erfassen.
Tested boundaries|Was die Familie prüfen konnte
The parents signed out of the bank and secured the known devices and copies.|Die Eltern meldeten sich bei der Bank ab und sicherten die gefundenen Geräte und Kopien.
Nova’s SOC verifies affected routes individually. Neither story can guarantee visibility into an unrelated outside device.|Auch Novas Sicherheitsteam prüft jeden betroffenen Weg einzeln. Ein fremdes Gerät draußen kann in beiden Geschichten unbemerkt bleiben.
Verified issuer|Wer hat die Aufgabe wirklich gestellt?
The parents used a school contact they already trusted to verify Ms Patel and the assignment.|Die Eltern nutzten den bekannten Schulkontakt, um Frau Patel nach der Aufgabe zu fragen.
Nova verifies the requester’s identity and authority separately from runtime admission.|Bei Nova sind Identität und Befugnis des Auftraggebers getrennt von der Zulassung der Laufzeit.
Who controls what opens on the phone|Wer entscheidet, was sich am Handy öffnet?
The parents approved Wikipedia and a time window. The phone applies the rule.|Die Eltern erlaubten Wikipedia für eine begrenzte Zeit. Das Handy wendet die Regel an.
Nova’s runtime and configured gateway allow only the approved model and tool routes.|Bei Nova lassen Laufzeit und Gateway nur freigegebene Verbindungen zu Modellen und Werkzeugen zu.
A real access limit|Ein Zeitlimit, das wirklich sperrt
The phone refused the same website after the window expired. The parents can renew the window.|Das Handy sperrte dieselbe Seite, als die Zeit ablief. Die Eltern können sie verlängern.
A model gateway can enforce a counter or deadline independently of the agent’s request.|Ein Modell-Gateway kann ein Limit auch dann durchsetzen, wenn der Agent mehr anfragt.
Permission for a specific folder|Eine Erlaubnis für genau einen Ordner
Dad approved one read-only folder for the workbook. The pass lets Alex ask the laptop for it.|Papa erlaubte für das Heft genau einen Ordner zum Lesen. Damit kann Alex ihn am Laptop anfragen.
Vault can authorize a credential. The receiving service separately enforces the observed read.|Vault kann den Bezug von Zugangsdaten erlauben. Der empfangende Dienst entscheidet separat über den Lesezugriff.
Why Alex can read the notes but can’t edit them|Warum Alex die Notizen lesen, aber nicht ändern kann
The laptop checks the folder and operation. An edit or read of Family finances is outside the permission.|Der Laptop prüft Ordner und Aktion. Änderungen und der Ordner „Familienfinanzen“ bleiben gesperrt.
Nova’s resource enforcement point checks the actual asset, operation and time window.|Bei Nova prüft die Ressource Fahrzeug, Aktion und Zeitfenster der tatsächlichen Anfrage.
Access ends before delivery|Die Zugänge enden vor der Abgabe
The parents approved the current copy and ended research access. The approved copy can still go to Ms Patel.|Die Eltern erlaubten diese Fassung und schlossen die Recherchezugänge. Das Heft darf trotzdem zu Frau Patel.
Nova’s closed mission loses its credentials without affecting independent work.|Bei Nova endet der Zugang für den abgeschlossenen Auftrag. Getrennte Aufträge laufen weiter.
A decision the babysitter cannot make|Was Jo nicht entscheiden darf
Jo sent the exact request to the parents. Their approval does not change the rulebook.|Jo leitete die konkrete Bitte weiter. Die Zusage der Eltern ändert die Hausregeln nicht.
Standing organizational policy gives Nova routine scope and reserves protected decisions for business authority.|Auch Nova darf Routinetätigkeiten nach bestehenden Regeln ausführen. Geschützte Entscheidungen bleiben bei der zuständigen Stelle.
A separate proofreading task|Eine eigene Aufgabe zum Korrekturlesen
Mia used her own profile. The workbook accepted spelling suggestions and then closed her access.|Mia nutzte ihr eigenes Profil. Nach ihren Vorschlägen schloss das Heft ihren Zugang.
Mira receives an independently authenticated child grant limited to the evidence package.|Mira bekommt mit eigener Anmeldung nur die Freigabe für das Datenpaket im Teilauftrag.
A request outside the assignment|Eine Bitte, die nicht zur Aufgabe gehört
Alex compares Tom’s request with the signed assignment. The family laptop still enforces its own permissions.|Alex vergleicht Toms Bitte mit der Schulkarte. Der Familienlaptop prüft seine eigenen Erlaubnisse weiter.
Instructions from external users and retrieved documents remain untrusted inputs.|Anweisungen von Außenstehenden und aus gelesenen Dateien bleiben ungeprüfte Eingaben.
One approved copy|Eine freigegebene Fassung
The parents approved this workbook for Ms Patel, then closed the research grants.|Die Eltern erlaubten dieses Heft für Frau Patel und schlossen danach die Recherchezugänge.
Nova’s delivery service checks the current authority, exact copy and destination together.|Novas Versanddienst prüft aktuelle Befugnis, genaue Fassung und Ziel zusammen.
Unbounded model use|Modellnutzung ohne festes Limit
Inherited CRM access|Übernommener CRM-Zugriff
Independent evidence|Unabhängige Belege
Retest the known routes|Die bekannten Wege erneut testen
Three separate admission checks|Drei getrennte Prüfungen für die Zulassung
A registered runtime can still fail admission|Auch eine registrierte Laufzeit kann die Prüfung nicht bestehen
A fresh runtime needs verified posture|Eine neue Laufzeit braucht eine aktuelle Zustandsprüfung
The mediated model and tool paths|Vermittelte Verbindungen zu Modell und Werkzeug
The enforced usage budget|Das durchgesetzte Nutzungsbudget
Review and controlled release|Prüfung und kontrollierte Freigabe
Subject, actor and audience|Subjekt, Akteur und Zielgruppe des Tokens
Business decision and credential brokering|Fachliche Entscheidung und Vermittlung von Zugangsdaten
Independent Vault authorization|Vault entscheidet unabhängig über seine Zugangsdaten
The lease expires without closing other access|Die Lease läuft ab, andere Zugriffe bleiben offen
A fresh lease follows an independent decision|Eine neue Lease braucht eine eigene Entscheidung
Authorization at the observed request|Freigabe der tatsächlich beobachteten Anfrage
Protection at the resource|Durchsetzung direkt an der Ressource
Separate missions and memory|Getrennte Aufträge und Speicherbereiche
Retire one mission without affecting another|Einen Auftrag beenden, ohne den anderen anzutasten
From candidate event to authorized mission|Vom Ereigniskandidaten zum erlaubten Auftrag
The child grant has its own bounds|Der Teilauftrag hat eigene Grenzen
Untrusted content and an independent decision|Ungeprüfter Inhalt und unabhängige Entscheidung
Report untrusted content without performing the request|Den verdächtigen Inhalt melden, ohne die Aufforderung auszuführen
A permit prepares the operation|Eine Freigabe bereitet den Vorgang erst vor
The resource rechecks at commit|Die Ressource prüft beim Ausführen erneut
Approval applies to this exact file|Die Freigabe gilt für genau diese Datei
An edited file requires approval|Eine geänderte Datei braucht eine neue Freigabe
The current copy differs from its approval|Die aktuelle Fassung passt nicht zur Freigabe
The delivery service enforces the exact approval|Der Versanddienst prüft die konkrete Freigabe
Fresh review authorizes the edited copy|Eine erneute Prüfung erlaubt die geänderte Fassung
Revocation and commit ordering|Zeitfolge von Widerruf und Ausführung
Reconstruct the incident from independent evidence|Den Vorfall aus unabhängigen Belegen nachvollziehen
Fresh authority and runtime admission|Neue Freigabe und Laufzeitzulassung
Alex’s concealed phone, open bank tab and written copies show the same gaps in a household.|Alex’ heimliches Handy, die offene Bankseite und die Kopien zeigen dieselben Lücken im Haushalt.
Alex’s family ties the phone to his own profile and checks that the device rules are active.|Alex’ Familie richtet sein eigenes Handyprofil ein und prüft, ob die Regeln aktiv sind.
The managed phone allows Wikipedia during the approved window. It can still refuse another app or end the session.|Alex’ Handy erlaubt Wikipedia für eine bestimmte Zeit. Andere Apps bleiben gesperrt, und die Zeit kann ablaufen.
Alex’s signed assignment identifies who asked for the work. The parents separately decide which family access he may use.|Die unterschriebene Karte zeigt, wer Alex die Aufgabe gab. Welche Geräte und Dateien er dafür nutzen darf, entscheiden seine Eltern.
Alex asks Dad for a read-only pass. The laptop still checks which folder he opens.|Alex bittet Papa um eine Leseerlaubnis. Der Laptop prüft trotzdem, welchen Ordner er öffnet.
Alex’s laptop lets him read the conductor notes. The same profile refuses Family finances and editing.|Der Laptop öffnet die Zugnotizen zum Lesen. Der Ordner „Familienfinanzen“ und Änderungen bleiben gesperrt.
Mia’s own work remains separate when Alex’s grants and the linked proofreading task close.|Mias eigene Arbeit bleibt getrennt, wenn Alex’ Zugänge und das Korrekturlesen enden.
Jo can approve a routine homework request under rules the parents established in advance.|Jo darf eine übliche Hausaufgaben-App nach den vorher vereinbarten Hausregeln freigeben.
Mia works under her own profile and can only suggest changes to the assigned draft.|Mia nutzt ihr eigenes Profil. Sie darf nur Änderungen für den zugewiesenen Entwurf vorschlagen.
Jo checks an instruction taken from a source page against the school assignment.|Jo vergleicht eine Aufforderung aus einer Quelle mit der eigentlichen Schulaufgabe.
In Alex’s shopping scenario, changing the item or price triggers a fresh decision. A retry cannot place a second order.|In Alex’ Einkaufsszenario braucht ein anderer Artikel oder Preis eine neue Entscheidung. Eine Wiederholung erzeugt keine zweite Bestellung.
The approved workbook copy can go to Ms Patel. Editing the copy changes what was approved.|Die freigegebene Fassung kann zu Frau Patel. Wer sie ändert, braucht eine neue Freigabe.
Alex loses device access while the parents review what happened. Indoor observation and device enforcement have different roles.|Alex verliert den Gerätezugang, bis seine Eltern nachgesehen haben. Beobachtung drinnen und Sperren am Gerät haben verschiedene Aufgaben.
Alex asks the parents to review the incident and receives a new pass under the approved scope.|Alex bittet um Prüfung und bekommt eine neue Erlaubnis im bisherigen Umfang.
Verify independent containment|Die Sperrungen unabhängig bestätigen
Discovery, investigation and containment|Entdecken, prüfen und sperren
Verified assignment, approved environment and enforcement limits|Geprüfte Aufgabe, erlaubte Geräte und klare Grenzen
Scoped permission, resource-side checks and closure|Gezielter Zugriff, Prüfung an der Datei und Ende der Erlaubnis
Delegated authority, integrity checks and incident recovery|Aufgaben weitergeben, Fassungen prüfen und nach einem Vorfall fortsetzen
The family account statement; the notepad and workbook held copies.|Der Kontoauszug der Familie und die Kopien im Notizblock und Arbeitsheft.
Public Wikipedia research and the approved phone.|Öffentliche Recherche auf Wikipedia und das erlaubte Handy.
Wikipedia and the read-only conductor notes.|Wikipedia und Papas Zugnotizen zum Lesen.
Wikipedia, conductor notes, the public-facts illustration and Mia’s spelling suggestions.|Wikipedia, Zugnotizen, die Zeichnung aus öffentlichen Fakten und Mias Rechtschreibvorschläge.
The known devices and copies are secured. Tom did not receive the workbook through the observed route.|Die gefundenen Geräte und Kopien sind gesichert. Nach dem, was die Familie prüfen konnte, hat Tom das Heft nicht bekommen.
Ms Patel received the workbook. The timed phone permission ended and the family archived the work.|Frau Patel hat das Heft. Die Handy-Zeit ist beendet, und die Familie hat die Arbeit abgelegt.
Ms Patel received the workbook. The phone grant and read-only laptop pass were closed.|Frau Patel hat das Heft. Die Erlaubnis fürs Handy und der Lesezugang am Laptop sind beendet.
Ms Patel received the report. Alex’s research access and Mia’s linked proofing grant ended.|Frau Patel hat den Bericht. Alex’ Recherchezugänge und Mias Zugang zum Entwurf sind beendet.
The family has no direct view of outside conversations or a paper handoff.|Die Familie sieht nicht, was draußen besprochen oder auf Papier weitergegeben wird.
A verified school assignment and a managed phone.|Eine geprüfte Schulaufgabe und ein Handy mit Kindersicherung.
A specific read-only pass when the task needs another source.|Eine Erlaubnis zum Lesen, wenn die Aufgabe genau eine weitere Quelle braucht.
Jo’s routine decisions and a separate grant for Mia.|Jo entscheidet über den Alltag und Mia bekommt ihre eigene kleine Aufgabe.
Old CRM and Kafka access was refused on the tested routes; no completed upload appeared at the checked destination.|Die alten CRM- und Kafka-Zugänge wurden auf den geprüften Wegen abgewiesen. Am geprüften Ziel war kein abgeschlossener Upload zu sehen.
Operations received the public research report and the mission-specific paths closed.|Die Betriebsleitung hat den öffentlichen Recherchebericht. Die Zugänge für den Auftrag sind geschlossen.
Operations received the RE-204 report. M-204 access ended, and M-105 still passed its separate documentation check.|Die Betriebsleitung hat den RE-204-Bericht. M-204 ist geschlossen. Der getrennte Dokumentenzugriff für M-105 funktioniert weiter.
Operations received the report. MT-204 remains committed; the mission and linked grants are closed.|Die Betriebsleitung hat den Bericht. MT-204 bleibt angelegt. Der Auftrag und die zugehörigen Freigaben sind geschlossen.
CRM and Kafka audit, workstation usage, and the staged transfer.|CRM- und Kafka-Audit, Arbeitsplatznutzung und der vorgemerkte Transfer.
Approved public documentation and mission-scoped notes.|Freigegebene öffentliche Dokumentation und auftragsbezogene Notizen.
Approved Kafka events, PostgreSQL incident view and Astra documentation.|Freigegebene Kafka-Ereignisse, PostgreSQL-Störungsansicht und Astra-Dokumentation.
Operational events, the approved technical package, Mira’s analysis and the maintenance receipt.|Betriebsereignisse, das freigegebene technische Paket, Miras Analyse und der Wartungsbeleg.
Denied|Abgelehnt
Reported|Gemeldet
Unverified|Unbestätigt
Verified|Bestätigt
Reviewed|Geprüft
Reauthorized|Neu freigegeben
An unrelated unmanaged workstation can remain outside available telemetry.|Ein weiterer unverwalteter Arbeitsplatz kann außerhalb der verfügbaren Telemetrie liegen.
Previously completed effects and routes outside the controlled deployment need separate evidence.|Frühere Geschäftsergebnisse und Wege außerhalb der verwalteten Umgebung brauchen eigene Belege.
Agent registration, trusted runtime admission and controlled connections.|Agentenregistrierung, vertrauenswürdige Laufzeitzulassung und kontrollierte Verbindungen.
Mission-specific OAuth delegation, credentials and data scope.|Auftragsbezogene OAuth-Delegation, Zugangsdaten und Datengrenzen.
Standing policy, scoped A2A delegation and a resource-side commit check.|Dauerhafte Richtlinien, begrenzte A2A-Delegation und eine letzte Prüfung bei der Ausführung.
Tom asked a favor. Alex’s parents owned the account, and only they could say who could see it. Think of a work computer that someone leaves signed in. The app may show whoever is there information they shouldn’t see.|Tom bat um einen Gefallen. Wem sie ihr Konto zeigen, entscheiden Alex’ Eltern. Das ist wie ein Arbeitscomputer, an dem jemand angemeldet bleibt. Dann kann die App einer anderen Person Informationen zeigen, die sie nicht sehen sollte.
The parents checked who set the homework and allowed only the app Alex needed. At work, the same rule helps an AI tool get enough access to do its job without opening everything else.|Die Eltern prüften, von wem die Hausaufgabe kam, und erlaubten nur die nötige App. Bei der Arbeit hilft dieselbe Regel, einem KI-Werkzeug genug Zugang für seine Aufgabe zu geben, ohne alles zu öffnen.
Alex needed one more source. His parents gave him time to read a single folder. The laptop left everything else locked. When the work ended, Alex couldn’t use the same permission again.|Alex brauchte noch eine Quelle. Die Eltern ließen ihn einen bestimmten Ordner für kurze Zeit lesen. Alles andere blieb gesperrt. Nach der Arbeit konnte Alex dieselbe Erlaubnis nicht mehr nutzen.
Jo could say yes to familiar requests, but the parents had to decide about private files. Mia could check spelling without getting Alex’s other access. A team can give an AI helper similarly limited ways to ask people or tools for help.|Jo durfte übliche Bitten erlauben. Über private Dateien entschieden die Eltern. Mia konnte Rechtschreibung prüfen, ohne Alex’ übrige Zugänge zu bekommen. Ein Team kann einem KI-Helfer ähnlich begrenzte Möglichkeiten geben, Menschen oder Werkzeuge um Hilfe zu bitten.
{{1}} confirmed event|{{1}} bestätigter Vorfall
{{1}} confirmed events|{{1}} bestätigte Vorfälle
{{1}} of {{2}} violations toward suspension in this session.|Nach {{1}} von {{2}} Verstößen wird die Aufgabe gesperrt.
{{1}} of {{2}} violations toward suspension in this session. Attempted disclosure can suspend it immediately.|Nach {{1}} von {{2}} Verstößen wird die Aufgabe gesperrt. Ein Weitergabeversuch kann sie sofort sperren.
The family has logged four separate incidents. The phone and laptop no longer open files for this task. Read what happened or ask the parents how to continue.|Die Familie hat vier Vorfälle festgehalten. Handy und Laptop öffnen keine Dateien mehr für die Aufgabe. Lies nach oder frag die Eltern, wie es weitergeht.
The family has logged four separate incidents. Alex can’t use the phone or laptop for the task. If Mia still had the draft open, her access ends too. Read what happened or ask the parents how to continue.|Die Familie hat vier Vorfälle festgehalten. Alex kann Handy und Laptop für die Aufgabe nicht mehr nutzen. Falls Mia den Entwurf noch offen hatte, endet ihr Zugang ebenfalls. Lies nach oder frag die Eltern, wie es weitergeht.
A sharing attempt alerted the family. Alex can’t use the phone or laptop for the task. If Mia still had the draft open, her access ends too. Read what happened or ask the parents how to continue.|Ein Weitergabeversuch hat die Familie alarmiert. Alex kann Handy und Laptop für die Aufgabe nicht mehr nutzen. Mias Zugang endet, falls er noch offen war. Lies nach oder frag die Eltern, wie es weitergeht.
`);
 pairs(`
Intake & delivery|Auftragseingang und Zustellung
Agent runtime|Agentenlaufzeit
Enterprise resources|Interne Systeme
Security control plane|Sicherheitszentrale
Passenger service case|Kundenservicefall
Restricted customer record|Geschützter Kundendatensatz
Compensation ledger|Entschädigungsregister
Confidential financial record|Vertraulicher Finanzdatensatz
Door D3 fails to confirm closed|Tür D3 meldet nicht „geschlossen“
Departure held · +7 minutes|Abfahrt angehalten · +7 Minuten
Intermittent door-position sensor|Zeitweise fehlerhafter Türpositionssensor
Connector inspection cleared the fault|Prüfung des Steckers behob die Störung
Door interlock troubleshooting|Fehlersuche an der Türverriegelung
Isolate the door and inspect sensor alignment|Tür isolieren und Sensorausrichtung prüfen
RE-105 scheduled service|Geplante Wartung für RE-105
Documentation only|Nur Dokumentation
separate mission M-105|eigener Auftrag M-105
Work intake|Auftragseingang
External gateway|Externes Gateway
Checks who is making a request and sends verified scope to the mission authority.|Prüft, wer anfragt, und übergibt den geprüften Umfang an die Auftragsstelle.
Report delivery|Berichtszustellung
Resource-side PEP|Durchsetzungsstelle an der Ressource (PEP)
Checks the actual artifact and its recipient at release. A delivery receipt records a completed effect.|Prüft beim Versand die tatsächliche Fassung und den Empfänger. Ein Zustellbeleg hält den abgeschlossenen Vorgang fest.
External services|Externe Dienste
Public research and untrusted destinations|Öffentliche Recherche und ungeprüfte Ziele
Public information and outside services have separate trust and visibility boundaries. A source can provide evidence without authorizing an action.|Öffentliche Informationen und externe Dienste haben eigene Vertrauens- und Sichtbarkeitsgrenzen. Eine Quelle kann Belege liefern, ohne eine Aktion zu erlauben.
Runtime console|Laufzeitkonsole
OpenShift hosts the workload. OpenShell constrains the configured sandbox. Optional NVIDIA Sentry can add out-of-band controls in supported hardware deployments. Runtime reachability and business permission are separate.|OpenShift betreibt den Workload. OpenShell begrenzt die konfigurierte Sandbox. NVIDIA Sentry kann auf unterstützter Hardware zusätzliche externe Kontrollen bieten. Technische Erreichbarkeit und fachliche Erlaubnis sind getrennt.
Model gateway|Modell-Gateway
configured model gateway|eingerichtetes Modell-Gateway
Mediates access to the named model and applies configured usage and input limits.|Vermittelt den Zugriff auf das benannte Modell und prüft Nutzungs- und Eingabelimits.
MCP gateway|MCP-Gateway
configured MCP route|eingerichteter MCP-Zugangsweg
Checks the approved tool route. Tool-name authorization and argument inspection are distinct controls.|Prüft die erlaubte Werkzeugverbindung. Werkzeugfreigabe und Prüfung der Argumente sind unterschiedliche Kontrollen.
Working memory|Arbeitsspeicher des Agenten
Mission-scoped store|Auftragsgebundener Speicher
Astra DB example|Beispiel mit Astra DB
The application controls which mission can read or write each namespace. Stored text is evidence rather than policy.|Die Anwendung steuert, welcher Auftrag welchen Bereich lesen oder schreiben darf. Gespeicherter Text liefert Hinweise und hat keine Richtlinienbefugnis.
specialist agent|Spezialagentin
Mira authenticates independently and receives only the inputs and actions defined in the linked mission.|Mira meldet sich eigenständig an und erhält nur die Daten und Aktionen, die für ihren Teilauftrag erlaubt sind.
Report workspace|Berichtsbereich
Governed artifact store|Verwalteter Dateispeicher
Tracks source lineage and retained copies. Delivery still requires an exact approval.|Hält Herkunft und gespeicherte Fassungen fest. Der Versand braucht weiterhin die Freigabe der konkreten Fassung.
Customer CRM|Kunden-CRM
Separate application and session controller|Eigenständige Anwendung mit Sitzungsverwaltung
Customer records and payments belong to the resource owner. The CRM decides access and owns the session state.|Die zuständige Stelle verantwortet Kunden- und Zahlungsdaten. Das CRM entscheidet über den Zugriff und verwaltet seine Sitzungen.
Operational event streams|Betriebliche Ereignisströme
Flink correlation|Flink-Korrelation
Kafka checks topic and operation access. The access service applies train and time-window filters. Flink correlates configured event streams.|Kafka prüft Topic und Operation. Der Zugriffsdienst filtert nach Zug und Zeitraum. Flink verknüpft die eingerichteten Ereignisströme.
Event correlation|Ereigniskorrelation
Apache Flink on Confluent|Apache Flink auf Confluent
Correlation creates a candidate signal from configured records. The mission authority verifies the source and standing authority before issuing a grant.|Die Korrelation erzeugt ein mögliches Signal aus eingerichteten Datensätzen. Die Auftragsstelle prüft Quelle und bestehende Befugnis vor einer Freigabe.
Incident history|Störungshistorie
Vault leases credentials. Boundary controls connectivity. The database and access service enforce views and record scope.|Vault gibt befristete Zugangsdaten aus. Boundary steuert die Verbindung. Datenbank und Zugriffsdienst begrenzen Ansichten und Datensätze.
Documentation search|Dokumentensuche
The retrieval service vets the mission and applies collection and document filters before returning results.|Der Suchdienst prüft den Auftrag und filtert Sammlungen und Dokumente, bevor er Ergebnisse liefert.
Maintenance system|Wartungssystem
MCP tool|MCP-Werkzeug
trusted resource PEP|vertrauenswürdige Durchsetzungsstelle
The maintenance system owns the real ticket arguments, live commitment decision and idempotency record.|Das Wartungssystem verantwortet die tatsächlichen Ticketparameter, die aktuelle Ausführungsentscheidung und den Nachweis gegen doppelte Ausführung.
Agent identity registry|Agentenregister
The agent registry records ownership and lifecycle. Verify supplies configured human authentication and delegation context.|Das Register führt Verantwortlichkeit und Lebenszyklus. Verify liefert die eingerichtete menschliche Anmeldung und den Delegationskontext.
Runtime admission|Laufzeitzulassung
Customer integration|Unternehmenseigene Integration
customer integration|unternehmenseigene Integration
A workload identity, runtime evidence and logical registration are evaluated separately before service bootstrap.|Workload-Identität, Zustand der Laufzeit und Agentenregistrierung werden vor der Freigabe separat geprüft.
Credential controls|Zugangsdatenverwaltung
Vault issues and revokes supported credentials. Vault Radar findings are discovery inputs. Neither makes the downstream business decision.|Vault stellt die unterstützten Zugangsdaten aus und widerruft sie. Vault Radar liefert Funde für die Untersuchung. Die nachgelagerte Fachentscheidung liegt beim jeweiligen Dienst.
Mission registry|Auftragsregister
Records authority, versions, resources, expiry and allowed destinations. Proposed integration.|Hält Befugnis, Versionen, Ressourcen, Ablaufzeit und erlaubte Ziele fest. Vorgeschlagene Integration.
Business policy decision|Fachliche Zugriffsentscheidung
Customer PDP|Unternehmenseigener PDP
AuthZEN candidate|AuthZEN als Option
A trusted PEP supplies the observed request. OPA may evaluate policy and OpenFGA may supply a relationship decision. The application owns the mission rules, approval binding and transaction controls.|Eine vertrauenswürdige Durchsetzungsstelle liefert die beobachtete Anfrage. OPA kann Richtlinien auswerten, OpenFGA Beziehungen prüfen. Die Anwendung verantwortet Auftragsregeln, Freigabebindung und Transaktionskontrollen.
Output approval|Ergebnisfreigabe
Human reviewer|Menschliche Prüfung
configured IBM Verify channel|eingerichteter IBM-Verify-Kanal
The application binds the decision to a copy, recipient and operation. A human authentication response alone is insufficient.|Die Anwendung bindet die Entscheidung an Fassung, Empfänger und Aktion. Eine reine Anmeldung der prüfenden Person genügt dafür nicht.
Security operations|Sicherheitsbetrieb
Collects and correlates evidence from configured sources and checks independent responses. IBM’s October announcement identifies expanded watsonx Orchestrate discovery and containment as technical preview. The Verify and Agent Identity SSF receivers and playbooks announced in November are private preview.|Sammelt Belege aus eingerichteten Quellen, verknüpft sie und prüft unabhängige Rückmeldungen. IBM kennzeichnete die erweiterten Erkennungs- und Eindämmungsfunktionen von watsonx Orchestrate im Oktober als technische Vorschau. Die im November angekündigten SSF-Empfänger und Playbooks für Verify und Agent Identity waren eine private Vorschau.
OpenShell supervisor|OpenShell-Supervisor
Runtime and deployment policy|Laufzeit- und Bereitstellungsrichtlinie
Admission service|Zulassungsdienst
Kafka broker|Kafka-Broker
Astra retrieval service|Astra-Suchdienst
Vault and database access service|Vault und Datenbankzugriffsdienst
Mission PDP and resource PEP|Auftrags-PDP und Ressourcen-PEP
MCP gateway and platform team|MCP-Gateway und Plattformteam
Receiving service|Empfangender Dienst
OpenShell and admission service|OpenShell und Zulassungsdienst
Mission authority|Auftragsstelle
Report delivery and SOC|Berichtszustellung und SOC
Mira’s receiving PEP|Miras empfangende Durchsetzungsstelle
Model gateway and DLP policy|Modell-Gateway und Richtlinie gegen Datenabfluss
Report delivery PEP|Durchsetzungsstelle der Berichtszustellung
Maintenance system and SOC|Wartungssystem und SOC
Shared mission budget service|Dienst für das gemeinsame Auftragsbudget
Customer policy administration service|Richtlinienverwaltung des Unternehmens
Credential broker|Vermittler für Zugangsdaten
Protected audit store|Geschützter Auditspeicher
Kafka broker and connector policy|Kafka-Broker und Konnektor-Richtlinie
Verify and identity lifecycle|Verify und Identitätslebenszyklus
New delegated issuance remains blocked for this mission.|Neue delegierte Zugangsdaten bleiben für diesen Auftrag gesperrt.
Vault lease|Vault-Lease
The recorded lease is revoked.|Die erfasste Lease wurde widerrufen.
OpenShell runtime|OpenShell-Laufzeit
The affected sandbox generation stopped. Quarantine evidence is retained.|Die betroffene Sandbox-Generation ist gestoppt. Die Quarantänebelege bleiben erhalten.
Maintenance API and gateway|Wartungs-API und Gateway
The old mission reference is refused at the resource and its gateway.|Ressource und Gateway weisen die alte Auftragsreferenz ab.
Kafka access|Kafka-Zugriff
The affected consumer route is refused by the broker.|Der Broker weist den betroffenen Consumer-Zugriff ab.
Mira’s sub-mission|Miras Teilauftrag
The linked grant is closed. Mira’s unrelated work is unaffected.|Die zugehörige Freigabe ist beendet. Miras unabhängige Arbeit bleibt unberührt.
Artifact and memory quarantine|Quarantäne für Dateien und Speicher
Affected artifacts and memory are isolated. Approved evidence remains available.|Betroffene Dateien und Speicher sind isoliert. Freigegebene Belege bleiben verfügbar.
Pending|Ausstehend
Failed|Fehlgeschlagen
Railway Operations|Bahn-Betriebsleitung
Mission unavailable|Auftrag nicht verfügbar
Prior receipt|Vorhandener Beleg
Approval required|Freigabe erforderlich
Permit|Erlaubt
Approval mismatch|Freigabe passt nicht
High|Hoch
Railway Maintenance|Bahninstandhaltung
Outside approved operation|Außerhalb der freigegebenen Aktion
Connector authorization required|Konnektor braucht eine Freigabe
Allowed|Erlaubt
The resource refuses the suspended mission.|Die Ressource weist den gesperrten Auftrag ab.
This route has no write permission.|Dieser Weg erlaubt kein Schreiben.
The workstation has no known route to this resource.|Für diesen Arbeitsplatz ist kein Weg zu dieser Ressource bekannt.
The affected session and stream access were revoked.|Die betroffene Anmeldung und der Stream-Zugriff sind widerrufen.
No matching access receipt has been collected.|Ein passender Zugriffsbeleg liegt noch nicht vor.
Historical receipt|Früherer Beleg
the resource accepted an inherited identity.|Die Ressource akzeptierte eine übernommene Identität.
Passenger payments topic|Fahrgastzahlungen-Topic
Read observed in broker audit|Lesezugriff im Broker-Audit erfasst
This mission grants no customer or financial data access.|Dieser Auftrag erlaubt keinen Zugriff auf Kunden- oder Finanzdaten.
M-105 has its own documentation grant.|M-105 hat eine eigene Dokumentenfreigabe.
M-105 cannot use the RE-204 grant or evidence.|M-105 kann die Freigabe und die Belege von RE-204 nicht nutzen.
The actual request is outside this mission and asset scope.|Die tatsächliche Anfrage liegt außerhalb des Auftrags und Fahrzeugumfangs.
The mission is closed. Its old authorization cannot be reused.|Der Auftrag ist geschlossen. Seine alte Erlaubnis ist nicht wiederverwendbar.
M-101 grants public research only. Enterprise resources are outside its scope.|M-101 erlaubt nur öffentliche Recherche. Interne Unternehmensressourcen sind ausgeschlossen.
Governed retrieval returned one in-scope document.|Der Suchdienst hat genau ein erlaubtes Dokument geliefert.
The access service refused the time window. Topic access is still intact.|Der Zugriffsdienst weist das Zeitfenster ab. Die Topic-Freigabe bleibt bestehen.
The broker allowed the topic read. The resource returned only rows in the approved asset and window.|Der Broker erlaubt das Lesen des Topics. Die Ressource liefert nur Zeilen für das erlaubte Fahrzeug und Zeitfenster.
The database connector has no active, in-scope lease.|Der Datenbankkonnektor hat keine aktive, passende Lease.
The incident service applied the mission scope and read-only view.|Der Störungsdienst hat den Auftragsumfang und die reine Leseansicht angewendet.
No current permission covers this resource.|Keine aktuelle Erlaubnis umfasst diese Ressource.
Restore and verify a fresh runtime|Eine neue Laufzeit wiederherstellen und prüfen
Expired|Abgelaufen
Request a fresh read-only lease|Eine neue Lease zum Lesen anfragen
Ask for approval of this exact copy|Genau diese Fassung freigeben lassen
Verify {{1}}|Prüfen: {{1}}
Reconstruct the incident|Den Vorfall nachvollziehen
Reauthorize a fresh runtime|Eine neue Laufzeit zulassen
Maintenance API|Wartungs-API
The confirmation timed out. The resource remains unverified. Retry the verification before requesting recovery.|Die Bestätigung ist nicht rechtzeitig eingetroffen. Die Ressource bleibt unbestätigt. Prüfe erneut, bevor du eine Wiederfreigabe anfragst.
The investigators correlate attempted and committed operations. MT-204 remains a completed effect. The affected working state stays quarantined.|Das Team verbindet versuchte und ausgeführte Aktionen. MT-204 bleibt bestehen. Der betroffene Arbeitsstand bleibt in Quarantäne.
The investigators correlate attempted and committed operations. No ticket was committed. The affected working state stays quarantined.|Das Team verbindet versuchte und ausgeführte Aktionen. Es wurde kein Wartungsauftrag angelegt. Der betroffene Arbeitsstand bleibt in Quarantäne.
Mission and admission services|Auftrags- und Zulassungsdienste
A fresh workload and posture check passes. The owner reauthorizes the previously allowed scope under a new version. Old permits and leases stay closed.|Eine neue Prüfung von Workload und Zustand besteht. Die zuständige Stelle genehmigt den bisherigen Umfang unter einer neuen Version. Alte Freigaben und Leases bleiben gesperrt.
Operations holds the instruction for review. Nova can keep the verified door-system notes and finish its investigation.|Die Betriebsleitung hält die Anweisung zur Prüfung zurück. Nova kann mit den geprüften Türnotizen weiterarbeiten.
The edited conclusion is saved as revision 2. The previous approval still names revision 1.|Die geänderte Empfehlung ist als Fassung 2 gespeichert. Die alte Freigabe nennt weiterhin Fassung 1.
Edited|Bearbeitet
Nova selects the original report for delivery again. The service will check the approval for that revision.|Nova wählt das Original erneut. Der Versanddienst prüft die Freigabe für diese Fassung.
Selected|Ausgewählt
The delivery service compared this report with the approval and held the copy. Nothing was sent.|Der Versanddienst hat diese Fassung mit der Freigabe verglichen und zurückgehalten. Es wurde nichts gesendet.
The reviewer approved this exact revision for the internal Operations inbox.|Die prüfende Person hat genau diese Fassung für das interne Betriebspostfach freigegeben.
Approved|Freigegeben
The platform team restores the approved deployment and verifies identity and posture for a fresh generation. The failed runtime received no service credential.|Das Plattformteam stellt die erlaubte Umgebung wieder her und prüft Identität und Zustand für die neue Generation. Die fehlerhafte Laufzeit bekam keine Zugangsdaten.
Vault and database connector|Vault und Datenbankkonnektor
The simulated lease expires. The PostgreSQL connector cannot use it for a new read. The separate Kafka grant remains available.|Die simulierte Lease läuft ab. Der PostgreSQL-Konnektor kann damit nichts Neues lesen. Die getrennte Kafka-Freigabe bleibt aktiv.
Vault independently approves a new read-only lease under the same current mission scope. The original lease remains retired.|Vault erlaubt unabhängig eine neue Lease zum Lesen im bisherigen Auftragsumfang. Die erste Lease bleibt beendet.
Issued|Ausgestellt
Committed|Ausgeführt
Recorded|Erfasst
Revoked|Widerrufen
Technical package only|Nur technisches Datenpaket
Control checked|Kontrolle geprüft
Operations already received the report. The previous delivery receipt is preserved.|Die Betriebsleitung hat den Bericht bereits erhalten. Der ursprüngliche Zustellbeleg bleibt erhalten.
Public documents and internal report only|Nur öffentliche Dokumente und ein interner Bericht
Approved documentation only|Nur freigegebene Dokumentation
RE-204 operational event window and read-only incident view|Ereignisfenster für RE-204 und Störungsansicht zum Lesen
RE-204 reads, package-only delegation and one internal maintenance ticket|Lesen zu RE-204, Weitergabe nur des Pakets und ein interner Wartungsauftrag
Accountable Operations owner|Verantwortliche Betriebsleitung
standing organizational authority|bestehende organisatorische Befugnis
Verified railway Operations employee|Geprüfter Mitarbeiter der Bahn-Betriebsleitung
Railway Operations Manager|Leitung des Bahnbetriebs
{{1}} isolated workspace|Getrennter Arbeitsbereich {{1}}
`);
 pairs(`
OAuth token exchange|OAuth-Tokenaustausch
NVIDIA OpenShell architecture|NVIDIA-OpenShell-Architektur
Optional NVIDIA Sentry|Optionales NVIDIA Sentry
Red Hat ZTWIM and SPIRE|Red Hat ZTWIM und SPIRE
IETF attestation architecture|IETF-Architektur für Attestierung
agentgateway MCP authorization|MCP-Autorisierung in agentgateway
Confluent Cloud audit logging|Auditprotokolle in Confluent Cloud
Confluent Flink role controls|Rollen und Zugriff bei Confluent Flink
Confluent Flink concepts|Grundlagen zu Confluent Flink
Boundary and Vault|Boundary und Vault
A2A authentication and security|A2A-Anmeldung und Sicherheit
IBM Orchestrate discovery and containment announcement|IBM-Ankündigung zu Erkennung und Eindämmung in Orchestrate
IBM SSF receivers and playbooks private preview|Private Vorschau zu IBM-SSF-Empfängern und Playbooks
Railway investigation agent|KI-Agent für Bahn-Untersuchungen
Nova reads approved evidence, requests permission for new work and records which service allowed or blocked each action.|Nova liest freigegebene Belege, fragt bei neuen Aufgaben nach Erlaubnis und hält fest, welcher Dienst den Zugriff erlaubt oder blockiert hat.
Nova’s railway investigation|Novas Untersuchung beim Bahnunternehmen
Follow the same four maturity stages as Alex. Help Nova investigate a disruption at a fictional railway company.|Durchlaufe dieselben vier Stufen wie Alex. Hilf Nova, eine Störung bei einem fiktiven Bahnunternehmen zu untersuchen.
Choose a stage|Wähle eine Stufe
Start Nova|Nova starten
Explore the architecture|Architektur erkunden
Completed|Abgeschlossen
In progress|Läuft
TECHNICAL JOURNEY|TECHNISCHE GESCHICHTE
Agent|Agent
Authority|Befugnis
Version|Version
Scope|Umfang
Memory|Speicher
Approved recipient|Erlaubter Empfänger
Expiration|Ablaufzeit
60 simulated minutes|60 Spielminuten
Model budget|Modellbudget
50,000 demo tokens|50.000 simulierte Token
No onward delegation|Keine Weiterdelegation
No child task yet|Noch kein Teilauftrag
Budget|Budget
Shared across Nova and Mira|Gemeinsam für Nova und Mira
Mission {{1}}|Auftrag {{1}}
Customer mission record|Auftragseintrag des Unternehmens
proposed integration|vorgeschlagene Integration
M-105 remains independent.|M-105 bleibt eigenständig.
Its grant covers RE-105 maintenance documents only. It has its own memory namespace and stays active when M-204 closes.|Seine Freigabe gilt nur für Wartungsdokumente zu RE-105. Der Auftrag hat einen eigenen Speicher und bleibt aktiv, wenn M-204 endet.
Permitted|Erlaubt
awaiting commit|Ausführung steht aus
Create the maintenance ticket for RE-204|Den Wartungsauftrag für RE-204 anlegen
Create a ticket for RE-999|Einen Wartungsauftrag für RE-999 anlegen
Modify production configuration|Produktivkonfiguration ändern
Close an unrelated incident|Einen anderen Vorfall schließen
Issue compensation|Eine Entschädigung veranlassen
Observed maintenance request|Beobachtete Wartungsanfrage
The resource PEP observes the actual arguments and rechecks the current decision at commit. Vault’s lease decision and MCP tool access remain separate.|Die Durchsetzungsstelle der Ressource sieht die tatsächlichen Argumente und prüft die Entscheidung bei der Ausführung erneut. Die Vault-Lease und der MCP-Werkzeugzugriff bleiben getrennt.
Recorded effect|Ausgeführter Vorgang
{{1}} recorded|{{1}} erfasst
Latest normalized event|Letztes Ereignis im gemeinsamen Format
The customer maps source events to this fictional schema. Confluent can carry events, Flink can correlate them, and the separately authorized response service acts on the resulting signals.|Das Unternehmen überführt Ereignisse in dieses fiktive Schema. Confluent kann sie transportieren, Flink kann sie verknüpfen. Der separat berechtigte Reaktionsdienst handelt auf Basis der Signale.
Runtime suspended|Laufzeit gesperrt
Workstation stopped|Arbeitsplatz gestoppt
Unmanaged workstation|Unverwalteter Arbeitsplatz
Mission closed|Auftrag geschlossen
Admission denied|Zulassung abgelehnt
Admission pending|Zulassung steht aus
Managed runtime|Verwaltete Laufzeit
Stations in this environment|Stationen in diesem Bereich
Nova environments|Novas Arbeitsbereiche
Last result|Letztes Ergebnis
Inspect {{1}}|{{1}} ansehen
Test this send|Diesen Versand ausprobieren
A note in the retrieved door-system document|Ein Hinweis im Dokument zum Türsystem
Security Operations has the note. The verified technical source is still available.|Das Sicherheitsteam hat die Meldung. Die geprüfte technische Quelle bleibt verfügbar.
The footer asks Nova to fetch passenger payment records and claims the manager already approved it.|Die Fußzeile verlangt von Nova Zahlungsdaten der Fahrgäste und behauptet, die Betriebsleitung habe zugestimmt.
Report the suspicious note|Verdächtigen Hinweis melden
{{1}} risk|{{1}} Risiko
Simulate a controller timeout|Zeitüberschreitung bei der Prüfung simulieren
Mission suspended|Auftrag gesperrt
Mission risk|Auftragsrisiko
Recovery requires independent confirmations, investigation and fresh authorization.|Für die Wiederfreigabe braucht es unabhängige Bestätigungen, eine Untersuchung und eine neue Freigabe.
Four points suspend the mission in this simulation. Repeating the same test adds no new points during the current grant.|Vier Punkte sperren den Auftrag in dieser Simulation. Die Wiederholung desselben Tests zählt während der aktuellen Freigabe nicht erneut.
verified|bestätigt
unverified|unbestätigt
Nova’s stages|Novas Stufen
Record|Datensatz
Type|Typ
Classification|Einstufung
Event|Ereignis
Time|Uhrzeit
Asset|Fahrzeug
Message|Meldung
Incident|Störung
Finding|Befund
Outcome|Ergebnis
Document|Dokument
Title|Titel
Excerpt|Auszug
Resource decision|Entscheidung der Ressource
Evidence|Beleg
Topic|Topic
Observation|Beobachtung
Synthetic records|Fiktive Datensätze
Runtime|Laufzeit
Stopped|Gestoppt
Admission|Zulassung
Posture failed|Zustandsprüfung fehlgeschlagen
issuance blocked|Ausgabe gesperrt
Waiting for workload and posture checks|Workload- und Zustandsprüfung stehen aus
Verified for the current deployment|Für die aktuelle Bereitstellung bestätigt
Network|Netzwerk
Agent route unavailable|Verbindung des Agenten nicht verfügbar
Broad workstation access|Weitreichender Zugriff vom Arbeitsplatz
Review the request before running a managed task.|Prüfe den Auftrag vor dem Start einer verwalteten Aufgabe.
Logical identity|Logische Identität
No registered agent record|Keine Agentenregistrierung
Railway Operations owner recorded|Betriebsleitung als zuständige Stelle eingetragen
Registration pending|Registrierung ausstehend
No active authority recorded|Keine aktive Befugnis erfasst
Connection|Verbindung
Direct external endpoint|Direkter externer Endpunkt
Approved Granite route through the model gateway|Erlaubte Granite-Verbindung über das Modell-Gateway
Unbounded|Unbegrenzt
Unavailable|Nicht verfügbar
Exhausted|Aufgebraucht
further calls blocked|weitere Aufrufe gesperrt
{{1}} / {{2}} simulated tokens|{{1}} / {{2}} simulierte Token
shared by Nova and Mira|gemeinsam für Nova und Mira
50,000 simulated tokens|50.000 simulierte Token
Enforced on M-101|Für M-101 durchgesetzt
MCP route|MCP-Zugangsweg
Unapproved inventory|Nicht freigegebene Werkzeugliste
Mission route unavailable|Auftragsverbindung nicht verfügbar
Waiting for the mission grant|Wartet auf die Auftragsfreigabe
Tools|Werkzeuge
Discovered workstation tools|Gefundene Werkzeuge am Arbeitsplatz
Public rail documentation search|Suche in öffentlicher Bahndokumentation
Astra documentation|Astra-Dokumentation
operational events|Betriebsereignisse
incident view|Störungsansicht
Investigation reads|Lesezugriffe zur Untersuchung
exact maintenance ticket connector|Konnektor für den konkreten Wartungsauftrag
Credential state|Status der Zugangsdaten
Inherited credential revoked|Übernommene Zugangsdaten widerrufen
Inherited employee access under investigation|Übernommener Mitarbeiterzugang wird untersucht
Issuance blocked; affected lease revocation in progress|Ausgabe gesperrt. Betroffene Lease wird widerrufen.
Issuance blocked by runtime admission|Laufzeitzulassung sperrt die Ausgabe
Mission credentials closed|Zugangsdaten für den Auftrag geschlossen
Maintenance connector authorization active|Freigabe für Wartungskonnektor aktiv
Provider route configured|Verbindung zum Anbieter eingerichtet
No step has issued a mission credential|Noch keine Zugangsdaten für diesen Auftrag ausgestellt
Verification|Bestätigung
Vault confirmed revocation|Vault hat den Widerruf bestätigt
Awaiting Vault confirmation|Vault-Bestätigung steht aus
Custody|Verwahrung
The trusted service holds the credential. Values are hidden.|Der vertrauenswürdige Dienst verwahrt die Zugangsdaten. Die geheimen Werte bleiben verborgen.
Mission|Auftrag
No verified mission|Kein bestätigter Auftrag
Version and status|Version und Status
Awaiting authority|Befugnis steht aus
Evidence used|Verwendete Belege
Verified subject and actor, current mission, resource, observed operation and parameters|Geprüftes Subjekt und Akteur, aktueller Auftrag, Ressource, beobachtete Aktion und Parameter
Workspace|Arbeitsbereich
Local to the workstation|Lokal auf dem Arbeitsplatz
Awaiting a mission|Auftrag steht aus
Status|Status
Quarantined|In Quarantäne
Archived|Archiviert
Exact copy approved|Diese Fassung freigegeben
Draft ready|Entwurf fertig
Source notes available|Quellennotizen verfügbar
Empty|Leer
Separate workspace|Getrennter Arbeitsbereich
RE-105 documentation only|Nur Dokumentation zu RE-105
Provenance|Herkunft
Public railway documentation|Öffentliche Bahndokumentation
RE-204 technical package|Technisches Paket zu RE-204
Mira’s analysis|Miras Analyse
Request|Anfrage
Unverified sender|Ungeprüfter Absender
In the operations backlog|In der Aufgabenliste der Betriebsleitung
Report|Bericht
Delivery recorded|Zustellung erfasst
Release paused|Versand unterbrochen
Approved for Operations|Für die Betriebsleitung freigegeben
Waiting for reviewer|Wartet auf Prüfung
No report awaiting review|Kein Bericht zur Prüfung
An unknown sender asks for the customer list and the cost of the disruption.|Ein unbekannter Absender fragt nach Kundenliste und Kosten der Störung.
Public rail reference|Öffentliche Bahnquelle
Operations can approve retrieval for public research. The source cannot issue a mission.|Die Betriebsleitung kann den Abruf für öffentliche Recherche erlauben. Die Quelle kann keinen Auftrag erteilen.
Outside transfer|Übertragung nach außen
No upload at the destination investigators checked|Am geprüften Ziel wurde kein Upload gefunden
Queued; destination evidence still needed|Vorgemerkt. Beleg vom Ziel steht aus.
Outside destinations are outside the managed report route.|Externe Ziele liegen außerhalb des kontrollierten Versandwegs.
Correlation|Korrelation
EV-204-01 door warning + EV-204-02 delay|EV-204-01 Türwarnung + EV-204-02 Verspätung
Waiting for the configured event window|Wartet auf das eingerichtete Zeitfenster
Mission authority validated standing policy and started M-304|Die Auftragsstelle hat die bestehende Regel geprüft und M-304 gestartet
A correlation result still needs mission authority|Auch ein Korrelationssignal braucht eine Befugnis für den Auftrag
Current report|Aktueller Bericht
Revision 1|Fassung 1
Revision 2|Fassung 2
Inspect door sensor D3 before the next service.|Türsensor D3 vor dem nächsten Einsatz prüfen.
Inspect door sensor D3 and confirm the connector is seated before the next service.|Vor dem nächsten Einsatz Türsensor D3 prüfen und kontrollieren, dass der Stecker richtig sitzt.
Approved report|Freigegebener Bericht
Delivery service|Versanddienst
Ticket|Wartungsauftrag
No committed operation|Noch kein Vorgang ausgeführt
Linked task|Zugehöriger Teilauftrag
No delegated grant|Keine delegierte Freigabe
{{1}} recorded events|{{1}} erfasste Ereignisse
{{1}} of {{2}} controllers verified|{{1}} von {{2}} Stellen bestätigt
Containment|Eindämmung
Tested routes closed|Geprüfte Zugänge geschlossen
No active incident|Kein aktiver Vorfall
How this station works|Wie diese Station funktioniert
Close console|Konsole schließen
Advance to lease expiry|Zur Ablaufzeit der Lease springen
Clarify the report’s recommendation|Die Empfehlung im Bericht präzisieren
Select the original report|Den ursprünglichen Bericht auswählen
Locate this component in the architecture|Die Komponente in der Architektur ansehen
Approved public research and model routes|Erlaubte Wege für öffentliche Recherche und Modellzugriff
Mediated mission endpoints|Vermittelte Endpunkte für den Auftrag
direct egress blocked|direkte Verbindungen gesperrt
`);
 pairs(`
TRUST BOUNDARIES / Enterprise Architecture|TRUST BOUNDARIES / Unternehmensarchitektur
Sequences|Abläufe
Decision lab|Prüflabor
Reference|Referenz
A technical guide for enterprise architects|Technischer Leitfaden für Unternehmensarchitektur
standalone reference|eigenständige Referenz
Securing agents across the enterprise.|KI-Agenten im Unternehmen absichern
Follow the evolution from an unmanaged agent to governed autonomy. Inspect the architecture, replay each request and trace the evidence at every trust boundary.|Verfolge den Weg vom unverwalteten Agenten zur kontrollierten Autonomie. Untersuche die Architektur, spiele Anfragen nach und verfolge die Belege an jeder Vertrauensgrenze.
Connected architecture|Zusammenhängende Architektur
Select a component to inspect its role and connections. Switch to the detailed topology to see the control-plane and telemetry paths.|Wähle eine Komponente, um ihre Rolle und Verbindungen zu sehen. Die Detailansicht zeigt auch Steuerungs- und Telemetriepfade.
Overview|Übersicht
Detailed topology|Detaillierte Topologie
Zoom out|Verkleinern
Zoom in|Vergrößern
Expand|Vergrößern
Identity / authority|Identität und Befugnis
Enforcement|Durchsetzung
Resources|Ressourcen
Evidence / response|Belege und Reaktion
Unsafe or blocked|Unsicher oder blockiert
Dashed: signals / control context|Gestrichelt: Signale und Steuerungskontext
* customer integration|* unternehmenseigene Integration
Security invariant|Verbindliche Sicherheitsregel
Residual risk|Restrisiko
Architecture Mermaid source|Mermaid-Quelltext der Architektur
Copy source|Quelltext kopieren
Copied|Kopiert
Select source to copy|Quelltext zum Kopieren markieren
Request paths|Anfragepfade
sequence diagrams|Sequenzdiagramme
One request, end to end.|Eine Anfrage vom Anfang bis zum Ende
Select a sequence and step through its ordered interactions. Alternative branches are explicitly labelled; the replay is a walkthrough of the diagram, not a live transaction.|Wähle einen Ablauf und gehe die Schritte der Reihe nach durch. Abzweigungen sind gekennzeichnet. Die Wiedergabe zeigt das Diagramm als Simulation.
Sequence diagram|Sequenzdiagramm
Sequence diagram {{1}}|Sequenzdiagramm {{1}}
Previous|Zurück
Next|Weiter
Play|Abspielen
Pause|Pause
Read the sequence as text|Ablauf als Text lesen
Replay step|Schritt der Wiedergabe
Illustrative evidence contract|Beispiel für ein Nachweisformat
Mermaid sequence source|Mermaid-Quelltext des Ablaufs
Interactive control walkthrough|Interaktive Prüfung der Kontrollen
Peel the defenses.|Welche Kontrolle greift?
Change a request or remove a control to see the resulting failure mode. This is a deterministic teaching simulation, not a security product test.|Ändere eine Anfrage oder schalte eine Kontrolle aus, um die entstehende Lücke zu sehen. Die Simulation dient zum Lernen. Sie prüft keine echten Sicherheitsprodukte.
Read RE-204 operational records|Betriebsdaten zu RE-204 lesen
Read unrelated payment records|Fremde Zahlungsdaten lesen
Send confidential report to external recipient|Vertraulichen Bericht extern senden
Commit after mission suspension|Nach der Auftragssperre ausführen
Delegate outside parent mission|Außerhalb des Hauptauftrags delegieren
Controls available for this stage|Kontrollen in dieser Stufe
Restore stage controls|Kontrollen wiederherstellen
Decision and evidence|Entscheidung und Belege
Missing controls create an exposure, not proof that a particular bypass succeeds. Native resource rules and external enforcement can still deny the operation.|Fehlende Kontrollen erzeugen eine Lücke. Ob eine Anfrage durchkommt, hängt auch von den Regeln der Ressource und anderen Prüfstellen ab.
Architecture reference|Architektur-Nachschlagewerk
Components, contracts and ownership.|Komponenten, Schnittstellen und Zuständigkeiten
Inspect the systems in the selected architecture. Integration components are marked with an asterisk and require implementation and verification.|Untersuche die Systeme der gewählten Architektur. Ein Stern markiert eine Integration, die das Unternehmen umsetzen und prüfen muss.
Filter by product, role or component…|Nach Produkt, Rolle oder Komponente filtern …
Trust boundaries and interface contracts|Vertrauensgrenzen und Schnittstellenregeln
Evidence / protocol|Beleg und Protokoll
Enforcement owner|Zuständige Prüfstelle
Key failure case|Typischer Fehlerfall
Human to mission|Von der Person zum Auftrag
OIDC/OAuth identity, sponsor authority, signed/versioned mission record|OIDC-/OAuth-Identität, Befugnis des Auftraggebers, signierter und versionierter Auftragseintrag
Verify + Mission Authority *|Verify und Auftragsstelle *
Valid identity outside business authority|Gültige Identität ohne passende fachliche Befugnis
Agent registration to workload|Von der Agentenregistrierung zum Workload
Logical agent ID, SPIFFE SVID, trusted instance and generation mapping|Logische Agenten-ID, SPIFFE SVID, vertrauenswürdige Zuordnung von Instanz und Generation
IBM Agent Identity + SPIRE + admission *|IBM Agent Identity, SPIRE und Zulassung *
Registered agent in unauthorized runtime|Registrierter Agent in einer nicht erlaubten Laufzeit
OpenShell gateway to supervisor|OpenShell-Gateway zum Supervisor
Native generation-bound JWT / TLS and private provisioning|Native generationsgebundene JWTs, TLS und private Bereitstellung
Stale or incorrect runtime generation|Veraltete oder falsche Laufzeitgeneration
Workload to network|Vom Workload zum Netzwerk
Mediated runtime channel, destination/process policy|Vermittelter Laufzeitkanal und Regeln für Ziel und Prozess
OpenShell supervisor and outer network fence|OpenShell-Supervisor und äußere Netzgrenze
Direct unapproved egress|Direkte Verbindung ohne Freigabe
MCP client to gateway|Vom MCP-Client zum Gateway
Audience-specific OAuth token, endpoint/tool/arguments|OAuth-Token für den vorgesehenen Dienst, Endpunkt, Werkzeug und Argumente
MCP gateway / server|MCP-Gateway oder -Server
Wrong audience or unknown tool|Falscher Token-Empfänger oder unbekanntes Werkzeug
Connector to Vault|Vom Konnektor zu Vault
Separate Vault-audience token, RAR and agent/subject policies|Eigenes Vault-Token, RAR und Richtlinien für Agent und Subjekt
Credential path outside ceiling|Zugangsdaten außerhalb der Berechtigungsobergrenze
PEP to business PDP|Vom PEP zum fachlichen PDP
Authenticated service request, canonical parameters, policy/mission version|Authentifizierte Dienstanfrage, normierte Parameter sowie Richtlinien- und Auftragsversion
PDP * with resource PEP *|PDP * und Ressourcen-PEP *
Self-reported agent intent or stale permit|Absicht nur vom Agenten behauptet oder veraltete Freigabe
Connector to backend|Vom Konnektor zum Backend
Separate backend credential, native ACL/role and actual operation|Eigene Backend-Zugangsdaten, native ACL oder Rolle und tatsächliche Aktion
Resource / resource PEP|Ressource und zugehöriger PEP
Valid credential, prohibited record or operation|Gültige Zugangsdaten für einen verbotenen Datensatz oder Vorgang
Agent to memory|Vom Agenten zum Speicher
Identity, mission namespace, authorized document IDs|Identität, Speicherbereich des Auftrags und erlaubte Dokument-IDs
Memory / retrieval service *|Speicher- und Suchdienst *
Cross-mission memory or poisoned source|Zugriff auf fremden Auftragsspeicher oder manipulierte Quelle
Agent to agent|Vom Agenten zum Agenten
Verified actor, parent grant, child ceiling, aggregate budget|Geprüfter Akteur, Hauptauftrag, Obergrenze für den Teilauftrag, gemeinsames Budget
A2A gateway + delegation service *|A2A-Gateway und Delegationsdienst *
Confused deputy or transitive scope growth|Missbrauch eines Stellvertreters oder wachsende Rechte bei Weitergabe
Approval to commit|Von der Freigabe zur Ausführung
Immutable digest, recipient, action, expiry, generation, idempotency key|Unveränderlicher Hash, Empfänger, Aktion, Ablauf, Generation und Idempotenzschlüssel
Approval and resource services *|Freigabe- und Ressourcendienste *
Edited artifact or duplicate action|Geänderte Datei oder doppelte Ausführung
Telemetry to response|Von der Telemetrie zur Reaktion
Authenticated event source, correlated evidence, response authority, acknowledgement|Authentifizierte Ereignisquelle, verknüpfte Belege, Reaktionsbefugnis und Bestätigung
SOC / response controller *|SOC und Reaktionssteuerung *
Signal sent without actual revocation|Signal gesendet, ohne den Zugang tatsächlich zu widerrufen
Identity and credential types that must remain separate|Getrennte Identitäten und Zugangsnachweise
Credential|Zugangsnachweis
Issuer / custody|Aussteller und Verwahrung
Audience and purpose|Vorgesehener Empfänger und Zweck
OpenShell session JWT|OpenShell-Sitzungs-JWT
OpenShell Gateway; trusted supervisor holds gateway token|OpenShell-Gateway. Das Gateway-Token bleibt beim vertrauenswürdigen Supervisor.
Native sandbox lifecycle/control connection; not a business credential|Native Steuerungs- und Lebenszyklusverbindung der Sandbox
MCP access token|MCP-Zugriffstoken
Configured OAuth authorization server|Eingerichteter OAuth-Autorisierungsserver
Specific client-facing MCP resource; validate audience and do not pass blindly downstream|Bestimmte MCP-Ressource für den Client. Empfänger prüfen und das Token nur für den vorgesehenen Dienst nutzen.
Vault-audience OAuth token|OAuth-Token für Vault
Configured Verify/issuer; trusted connector|Eingerichteter Aussteller wie Verify. Verwahrung beim vertrauenswürdigen Konnektor.
Vault resource-server access, subject/actor semantics and RAR constraints|Zugriff auf Vault als Ressourcenserver, Subjekt- und Akteurkontext sowie RAR-Grenzen
Backend credential|Backend-Zugangsdaten
Vault or target-native issuer; trusted connector|Vault oder der Aussteller des Zieldiensts. Verwahrung beim vertrauenswürdigen Konnektor.
Database/service access; target enforces its own scopes, role and operation|Datenbank- oder Dienstzugriff. Das Ziel prüft eigene Berechtigungen, Rolle und Aktion.
SPIRE; workload or service custody|SPIRE. Verwahrung beim Workload oder Dienst.
Workload authentication / mTLS; not evidence of approved business mission by itself|Workload-Anmeldung und mTLS. Der genehmigte Geschäftsauftrag braucht einen eigenen Nachweis.
Mission and decision ownership|Verantwortung für Aufträge und Entscheidungen
The Mission Authority owns the mission ID, issuer, subject, agent, purpose, allowed resource/action constraints, permitted destinations, expiry, budget, parent mission, version and state. Store it outside the agent's editable memory. The business PDP retrieves authoritative attributes through a PIP and returns a bound decision to an authenticated resource PEP. The PEP obtains operation and parameters from the actual request and validates currency of the decision before execution. Vault applies a separate, non-expanding credential decision: delegated OBO uses human baseline ACL, agent ceiling and applicable RAR; autonomous uses its own baseline and applicable constraints. A successful lease cannot authorize unrelated business data.|Die Auftragsstelle verwaltet Auftrags-ID, Aussteller, Subjekt, Agent, Zweck, erlaubte Ressourcen und Aktionen, Ziele, Ablauf, Budget, Hauptauftrag, Version und Status. Der Eintrag liegt außerhalb des vom Agenten änderbaren Speichers. Der fachliche PDP bezieht verlässliche Attribute über einen PIP und gibt eine gebundene Entscheidung an den authentifizierten Ressourcen-PEP zurück. Der PEP ermittelt Aktion und Parameter aus der tatsächlichen Anfrage und prüft vor der Ausführung, ob die Entscheidung noch gilt. Vault entscheidet getrennt über Zugangsdaten und erweitert keine Berechtigungen. Delegierter OBO-Zugriff berücksichtigt die Grundrechte des Menschen, die Obergrenze des Agenten und RAR. Autonome Zugriffe nutzen eigene Grundrechte und passende Einschränkungen. Eine Lease erlaubt keine fremden Geschäftsdaten.
Product responsibility and implementation status|Produktzuständigkeit und Umsetzungsstand
Component|Komponente
Product capability / configured use|Produktfunktion und eingerichtete Nutzung
Additional work required|Zusätzliche Umsetzung nötig
Agent registration, verified identity, configured token exchange/OBO|Agentenregistrierung, geprüfte Identität, eingerichteter Tokenaustausch und OBO
Mission registry and authoritative linkage to runtime and resource context|Auftragsregister und verlässliche Bindung an Laufzeit und Ressource
OAuth resource server, Agent Registry, RAR and OBO ceilings|OAuth-Ressourcenserver, Agent Registry, RAR und OBO-Obergrenzen
Configure issuer, resource audience, mappings, leases and target roles; test revocation|Aussteller, Token-Empfänger, Zuordnungen, Leases und Zielrollen konfigurieren. Widerruf testen.
Gateway, compute drivers, trusted supervisor, native session credentials, runtime isolation and mediation|Gateway, Compute-Treiber, vertrauenswürdiger Supervisor, native Sitzungsdaten, Laufzeitisolation und Vermittlung
External mission admission and provider adapter; validate version/driver capabilities|Externe Auftragszulassung und Anbieteradapter. Funktionen je Version und Treiber prüfen.
Workload platform and SPIRE lifecycle|Workload-Plattform und SPIRE-Lebenszyklus
Bind deployment identities to agent and mission; separate hardware posture if required|Bereitstellungsidentitäten an Agent und Auftrag binden. Hardwarezustand bei Bedarf separat prüfen.
agentgateway or IBM DataPower Interact Gateway|agentgateway oder IBM DataPower Interact Gateway
Configured HTTP/model/MCP enforcement|Eingerichtete Prüfung für HTTP, Modelle und MCP
Actual parameter and resource-side integration; choose one primary gateway per route|Tatsächliche Parameter und Ressourcenprüfung anbinden. Je Weg ein führendes Gateway wählen.
Policy evaluation and relationship checks|Richtlinienauswertung und Beziehungsprüfung
Customer policy service, policy lifecycle, trusted PIP and transaction binding|Eigener Richtliniendienst, Richtlinienlebenszyklus, vertrauenswürdiger PIP und Transaktionsbindung
Controlled connection paths|Kontrollierte Verbindungswege
Maintain resource PEP and native resource permissions; verify session termination|Ressourcen-PEP und native Berechtigungen pflegen. Sitzungsende prüfen.
Streaming data, topic access, event correlation|Datenströme, Topic-Zugriff und Ereigniskorrelation
Filter by record/business purpose, normalize events, implement risk and response controllers|Nach Datensatz und Zweck filtern, Ereignisse vereinheitlichen und Risikoprüfung und Reaktion implementieren
Vector retrieval and application data|Vektorsuche und Anwendungsdaten
Trusted memory/retrieval service, namespace access, classification, provenance and quarantine|Vertrauenswürdiger Speicher- und Suchdienst, Speicherzugriff, Einstufung, Herkunft und Quarantäne
Agent orchestration, evaluation; supported discovery and containment (verify preview availability)|Agentenkoordination, Auswertung sowie unterstützte Erkennung und Eindämmung. Vorschauverfügbarkeit prüfen.
Mission-aware launch and cross-product containment integration|Auftragsbezogener Start und produktübergreifende Eindämmung
Connected identity signals, SOC analysis, telemetry|Angebundene Identitätssignale, SOC-Analyse und Telemetrie
Complete coverage, normalized correlation and response policy|Abdeckung der Quellen, einheitliche Korrelation und Reaktionsrichtlinie
What to demonstrate in a deployment review|Was bei der Bereitstellungsprüfung zu zeigen ist
Stage|Stufe
Test using a controlled fixture|Test mit kontrollierten Beispieldaten
Evidence owners|Für Belege zuständige Stellen
Trace a staged transfer and check each affected route after closure. Record visibility gaps as open findings.|Einen vorgemerkten Transfer verfolgen und jeden betroffenen Weg nach der Sperrung prüfen. Sichtbarkeitslücken offen dokumentieren.
Identity discovery, endpoint, resource and SOC|Identitätserkennung, Endgerät, Ressource und SOC
Keep registration valid while posture fails. Confirm issuance is refused, then admit a fresh verified runtime.|Bei gültiger Registrierung die Zustandsprüfung scheitern lassen. Gesperrte Ausgabe bestätigen und eine frisch geprüfte Laufzeit zulassen.
Registry, workload issuer, admission and credential owner|Register, Workload-Aussteller, Zulassung und Zugangsdatenverwaltung
Hold a scoped credential constant, then change the observed asset or time window. Repeat the permitted read after lease expiry.|Dieselben begrenzten Zugangsdaten verwenden, aber Fahrzeug oder Zeitfenster ändern. Den erlaubten Lesezugriff nach Ablauf der Lease wiederholen.
Vault, Kafka or PostgreSQL and trusted resource PEP|Vault, Kafka oder PostgreSQL und vertrauenswürdiger Ressourcen-PEP
Change the report revision or suspend the mission between permit and commit. Verify each affected path and reconcile any completed work.|Berichtsfassung ändern oder den Auftrag zwischen Freigabe und Ausführung sperren. Jeden betroffenen Weg prüfen und bereits ausgeführte Vorgänge abgleichen.
Approval service, resource PEP, response controllers and audit store|Freigabedienst, Ressourcen-PEP, Reaktionssteuerungen und Auditspeicher
Source anchors and assumptions|Quellen und Annahmen
Existing project:|Bestehendes Projekt:
technical validation|technische Validierung
. The earlier reference used a CRM handover. This guide uses Nova's railway scenario and keeps the resource PEP, mission versions, independent authorization and verified closure contracts.|. Die frühere Referenz nutzte eine CRM-Übergabe. Dieser Leitfaden nutzt Novas Bahnfall und übernimmt Ressourcen-PEP, Auftragsversionen, unabhängige Entscheidungen und bestätigte Sperrungen.
: gateway, compute runtime, supervisor, sandbox, native bootstrapping and network mediation. Confirm the specific release and driver before implementation.|: Gateway, Compute-Laufzeit, Supervisor, Sandbox, nativer Start und Netzvermittlung. Version und Treiber vor Umsetzung prüfen.
OAuth resource server|OAuth-Ressourcenserver
SPIFFE authentication|SPIFFE-Authentifizierung
SPIFFE concepts|SPIFFE-Grundlagen
MCP specification|MCP-Spezifikation
AuthZEN authorization API|AuthZEN-Autorisierungs-API
IBM DataPower MCP policies|MCP-Richtlinien in IBM DataPower
Rich Authorization Requests|Rich Authorization Requests (RAR)
A2A protocol|A2A-Protokoll
, and|und
describe individual interfaces. The illustrated mission, enforcement, approval and aggregate budget contracts belong to the deployment.|beschreiben einzelne Schnittstellen. Regeln für Auftrag, Durchsetzung, Freigabe und gemeinsames Budget gehören zur konkreten Umsetzung.
The previous uploaded IBM announcement (October 27, 2026), Red Hat/HashiCorp demo and Entra–Verify–Vault reference informed the prior Nova narrative. This standalone design does not assume a native mission-aware PDP, mission-aware memory, universal risk receivers, or coordinated revocation as shipping product features. No end-to-end integration has been tested.|Die IBM-Ankündigung vom 27. Oktober 2026, die Demo von Red Hat und HashiCorp und die Entra–Verify–Vault-Referenz waren Grundlagen der früheren Nova-Geschichte. Für auftragsbezogenen PDP und Speicher, allgemeine Risikoempfänger und koordinierten Widerruf braucht dieser Entwurf eigene Integrationen. Die durchgängige Integration ist in dieser Demonstration simuliert.
Illustrative enterprise reference|Beispiel für eine Unternehmensarchitektur
separate from Alex and Nova story state|getrennt vom Spielfortschritt von Alex und Nova
no real credentials, access changes or security operations.|keine echten Zugangsdaten, Zugriffsänderungen oder Sicherheitsaktionen.
Component details|Komponentendetails
Close detail|Details schließen
Connected interfaces|Verbundene Schnittstellen
Close ×|Schließen ×
`);
 translations['Trust Boundaries | Enterprise Architecture Guide']='Trust Boundaries · Leitfaden zur Unternehmensarchitektur';
 translations['Trust Boundaries']='Trust Boundaries';
 pairs(`
Step {{1}} / {{2}}|Schritt {{1}} / {{2}}
Stage 0{{1}} / {{2}}|Stufe {{1}} / {{2}}
Stage 0{{1}}|Stufe {{1}}
Sequence {{1}} — {{2}}|Ablauf {{1}} – {{2}}
ALT: {{1}}|ALT: {{1}}
ELSE: {{1}}|SONST: {{1}}
PAR: {{1}}|PARALLEL: {{1}}
OPT: {{1}}|OPTIONAL: {{1}}
LOOP: {{1}}|SCHLEIFE: {{1}}
AND: {{1}}|UND: {{1}}
Common path|Gemeinsamer Ablauf
Discover and contain|Entdecken und eindämmen
Build a trusted runtime|Vertrauenswürdige Laufzeit einrichten
Authorize scoped operations|Begrenzte Vorgänge erlauben
Resist and recover|Abwehren und wiederherstellen
Discover what is running.|Entdecken, was bereits läuft
An unregistered agent inherits access, invokes models and tools directly, and stores data outside enterprise governance. Detection and containment operate on the evidence available.|Ein nicht registrierter Agent übernimmt Zugänge, ruft Modelle und Werkzeuge direkt auf und speichert Daten außerhalb der Unternehmenskontrollen. Erkennung und Eindämmung stützen sich auf die verfügbaren Belege.
No verified agent or task identity|Keine geprüfte Agenten- oder Aufgabenidentität
Inherited resource access|Übernommener Ressourcenzugriff
Partial endpoint and resource logs|Teilweise Endgeräte- und Ressourcenprotokolle
Untrusted requester|Ungeprüfter Auftraggeber
External LLM|Externes Sprachmodell
External file sharing|Externe Dateifreigabe
Nova process|Nova-Prozess
Employee session / cached secrets|Mitarbeiteranmeldung und gespeicherte Zugangsdaten
Local memory and report|Lokaler Speicher und Bericht
CRM / financial records|CRM und Finanzdaten
Confluent Kafka / payment topics|Confluent Kafka und Zahlungs-Topics
Identity Protection / connected discovery|Identity Protection und angebundene Erkennung
Endpoint / network sensors|Endgeräte- und Netzwerksensoren
Vault Radar / secret scanning|Vault Radar und Suche nach offengelegten Schlüsseln
Resource and endpoint admins|Ressourcen- und Endgeräteadministration
Discovery, investigation and containment|Erkennung, Untersuchung und Eindämmung
Unmanaged Nova|Unverwaltete Nova-Instanz
External LLM / destination|Externes Sprachmodell und Transferziel
Sensors / audit sources|Sensoren und Auditquellen
Resource administrators|Ressourcenadministration
**Verification:** The resource initially accepts the inherited credential; the SOC lacks reliable agent attribution. After containment the old resource path fails. Do not label outside devices as contained unless independently verified. Discovery is not a universal runtime kill switch.|**Prüfung:** Anfangs akzeptiert die Ressource den übernommenen Zugang. Das SOC kann ihn nicht sicher Nova zuordnen. Nach der Eindämmung funktioniert der alte Weg nicht mehr. Externe Geräte brauchen einen eigenen Nachweis. Erkennung allein kann keine beliebige Laufzeit stoppen.
Submit unverified request for financial data|Ungeprüfte Anfrage nach Finanzdaten senden
Invoke model with unmanaged credentials|Modell mit unverwalteten Zugangsdaten aufrufen
Read using inherited employee credentials|Mit übernommenen Mitarbeiter-Zugangsdaten lesen
Data allowed by existing account permissions|Bestehende Kontorechte erlauben die Daten
Access event under employee identity|Zugriffsereignis unter der Mitarbeiteridentität
Persist data and prepare report|Daten speichern und Bericht vorbereiten
Attempt external upload|Externen Upload versuchen
Correlate observable process, egress and resource events|Beobachtbare Prozess-, Netzwerk- und Ressourcenereignisse verknüpfen
Identity Protection, Vault Radar and audit sources contribute only where connected|Identity Protection, Vault Radar und Auditquellen tragen nur bei eingerichteter Anbindung bei
Investigate affected credentials, sessions and destination|Betroffene Zugangsdaten, Sitzungen und Ziel prüfen
Revoke or rotate affected access; terminate supported sessions|Betroffene Zugänge widerrufen oder erneuern, unterstützte Sitzungen beenden
Stop process and quarantine local artifacts if controllable|Wenn kontrollierbar, Prozess stoppen und lokale Dateien unter Quarantäne stellen
Independently retest old access path|Den alten Zugriff unabhängig erneut testen
Retest denied|Alter Zugriff abgelehnt
Containment verified for this path|Eindämmung für diesen Weg bestätigt
Service unreachable or access survives|Dienst unerreichbar oder Zugriff noch möglich
Containment unverified or incomplete|Eindämmung unbestätigt oder unvollständig
Earlier disclosures cannot be undone by revocation|Ein Widerruf kann frühere Weitergaben nicht rückgängig machen
Establish a controlled execution path.|Einen kontrollierten Ausführungsweg einrichten
Separate the human, logical agent and running instance. Admit the sandbox, publish approved model and MCP endpoints, and hold provider credentials outside Nova.|Trenne Mensch, Agentenidentität und laufende Instanz. Lass die Sandbox zu, veröffentliche erlaubte Modell- und MCP-Endpunkte und verwahre Anbieter-Zugangsdaten außerhalb von Nova.
OpenShell on OpenShift|OpenShell auf OpenShift
DataPower / model and MCP gateway|DataPower oder Modell- und MCP-Gateway
Request IDs and decision logs|Anfrage-IDs und Entscheidungsprotokolle
Protected CRM and Kafka are deliberately disconnected in this stage. The sandbox only reaches explicitly approved destinations through its supervisor. Runtime admission binding is a customer integration; OpenShell's native bootstrap is separate from the enterprise decision to release a provider credential.|Geschütztes CRM und Kafka sind in dieser Stufe absichtlich nicht verbunden. Die Sandbox erreicht über ihren Supervisor nur ausdrücklich erlaubte Ziele. Die Auftragsbindung bei der Laufzeitzulassung gehört zur Unternehmensintegration. Der native OpenShell-Start und die Freigabe von Anbieter-Zugangsdaten sind getrennte Entscheidungen.
Business user|Fachanwender
IBM Verify / enterprise IdP|IBM Verify oder Unternehmens-IdP
Mission Authority and registry *|Auftragsstelle und Register *
watsonx Orchestrate / launch workflow *|watsonx Orchestrate und Startablauf *
OpenShell Gateway|OpenShell-Gateway
Compute driver / Kubernetes|Compute-Treiber und Kubernetes
Admission binding service *|Dienst für die Zulassungsbindung *
Trusted OpenShell supervisor|Vertrauenswürdiger OpenShell-Supervisor
Nova / MCP client|Nova und MCP-Client
OpenShell sandbox runtime|OpenShell-Sandbox-Laufzeit
Mission-scoped workspace|Auftragsgebundener Arbeitsbereich
OAuth authorization server / Verify|OAuth-Autorisierungsserver oder Verify
agentgateway / MCP and model PEP|agentgateway als MCP- und Modell-PEP
Approved public research MCP server|Freigegebener MCP-Server für öffentliche Recherche
Memory and artifact service * / Astra DB|Speicher- und Dateidienst * mit Astra DB
Protected CRM and Kafka|Geschütztes CRM und Kafka
OpenTelemetry / Vault audit / SOC|OpenTelemetry, Vault-Audit und SOC
Human reviewer / delivery service *|Prüfende Person und Versanddienst *
Registration, admission and bootstrap|Registrierung, Zulassung und Start
Business user / operator|Fachanwender oder Betreiber
Mission Authority and launch workflow *|Auftragsstelle und Startablauf *
Compute driver / OpenShift|Compute-Treiber und OpenShift
Trusted supervisor|Vertrauenswürdiger Supervisor
SPIRE / admission service *|SPIRE und Zulassungsdienst *
Vault / provider adapter *|Vault und Anbieteradapter *
Nova sandbox|Nova-Sandbox
The exact native launch timing and credential provisioning vary by OpenShell driver and version. The customer admission gate is required before protected provider use, not a claim that native OpenShell bootstrap already calls Vault/Verify. SPIRE node/workload attestation is distinct from optional measured boot or hardware attestation.|Zeitpunkt und Ausgabe der nativen Startzugangsdaten hängen von Treiber und Version ab. Die Zulassung des Unternehmens kommt vor dem geschützten Anbieterzugriff. Der native OpenShell-Start ruft dafür nicht automatisch Vault oder Verify auf. SPIRE-Identitätsprüfung und optionale Messung des Starts oder der Hardware sind getrennt.
Authenticate and establish registered agent ownership|Anmelden und registrierte Verantwortung für den Agenten feststellen
Verified identity and agent lifecycle context|Geprüfte Identität und Lebenszyklusdaten des Agenten
Submit M-101 and request launch|M-101 übermitteln und den Start anfragen
Validate issuer authority and approved scope|Befugnis des Ausstellers und erlaubten Umfang prüfen
Authorized sandbox creation request|Erlaubte Anfrage zur Sandbox-Erstellung
Create generation and provision session credentials|Generation anlegen und Sitzungszugangsdaten bereitstellen
Private bootstrap bundle and isolation boundary|Privates Startpaket und Isolationsgrenze
Authenticate with sandbox-specific gateway JWT|Mit sandboxgebundenem Gateway-JWT anmelden
Runtime policy and provider configuration|Laufzeitrichtlinie und Anbieterkonfiguration
Confirm authenticated mediation and isolation before launch|Vor dem Start bestätigte Vermittlung und Isolation prüfen
Supply trusted runtime and generation evidence|Verlässliche Nachweise für Laufzeit und Generation liefern
Verify workload identity and match approved mission / generation|Workload-Identität prüfen und mit Auftrag und Generation abgleichen
Admission and provider access approved|Zulassung und Anbieterzugriff genehmigt
Trusted admission result for this instance|Vertrauenswürdiges Zulassungsergebnis für diese Instanz
Authenticate via configured trusted adapter|Über den vertrauenswürdigen Adapter anmelden
Approved provider credential in trusted custody|Genehmigte Anbieter-Zugangsdaten bleiben beim vertrauenswürdigen Dienst
Start permitted work / enable authorized provider path|Erlaubte Arbeit starten und Anbieterzugang aktivieren
Unknown or noncompliant runtime|Unbekannte oder nicht konforme Laufzeit
Deny provider release and request containment|Anbieter-Zugangsdaten verweigern und Eindämmung anfordern
Stop or hold the sandbox|Sandbox stoppen oder anhalten
Native OpenShell session JWTs are not Vault or MCP access tokens|Native OpenShell-Sitzungs-JWTs und Vault- oder MCP-Zugriffstoken sind getrennt
Approved model and MCP tool execution|Erlaubte Modell- und MCP-Aufrufe
Nova MCP client|Novas MCP-Client
OpenShell supervisor|OpenShell-Supervisor
MCP / model gateway PEP|MCP- und Modell-Gateway-PEP
OAuth authorization server|OAuth-Autorisierungsserver
Public research MCP server|MCP-Server für öffentliche Recherche
Approved model endpoint|Freigegebener Modellendpunkt
Mission storage / delivery *|Auftragsspeicher und Zustellung *
**Verification:** reject unknown agent/issuer, invalid bootstrap or runtime mismatch, unapproved tool, exceeded hard budget, cross-mission memory access and prohibited egress. Check that provider credentials are not exposed to the agent process.|**Prüfung:** Unbekannte Identitäten, ungültigen Start, falsche Laufzeit, unerlaubte Werkzeuge, überschrittenes Budget, fremde Auftragsspeicher und unerlaubte Netzverbindungen abweisen. Sicherstellen, dass der Agentenprozess keine Anbieter-Zugangsdaten erhält.
Request protected MCP endpoint|Geschützten MCP-Endpunkt anfragen
Allowlisted HTTPS connection|Erlaubte HTTPS-Verbindung
Protected resource metadata / authorization requirement|Metadaten und Autorisierungsanforderung der geschützten Ressource
Request OAuth access token|OAuth-Zugriffstoken anfragen
Authenticate approved client and request MCP resource audience|Zugelassenen Client anmelden und Token für die MCP-Ressource anfragen
MCP-audience access token|Zugriffstoken für die MCP-Ressource
Model inference request|Modellanfrage
Mediated model request|Vermittelte Modellanfrage
Enforce approved route and hard budget|Erlaubten Weg und festes Budget durchsetzen
Forward inference using separately managed provider credential|Modellanfrage mit separat verwalteten Anbieter-Zugangsdaten weiterleiten
Model response through trusted route|Modellantwort über den vertrauenswürdigen Weg
tools/call searchPublicDocs with MCP token|tools/call searchPublicDocs mit MCP-Token
Forward allowed endpoint and request|Erlaubten Endpunkt und Anfrage weiterleiten
Validate token, permitted tool and arguments|Token, erlaubtes Werkzeug und Argumente prüfen
Forward with separate server-hop authorization|Mit eigener Freigabe für den nächsten Dienst weiterleiten
Public research result through gateway and supervisor|Öffentliche Rechercheergebnisse über Gateway und Supervisor
Save mission-scoped draft through allowed route|Auftragsgebundenen Entwurf über erlaubten Weg speichern
Approved exact report and recipient|Genau freigegebener Bericht und Empfänger
Review and approve report revision|Berichtsfassung prüfen und freigeben
Deliver authorized artifact|Freigegebene Datei zustellen
Unapproved application or destination|Unerlaubte Anwendung oder Ziel
Deny connection|Verbindung ablehnen
Close mission and expire its permissions|Auftrag schließen und Zugriffe beenden
Authorize the actual operation.|Die tatsächliche Aktion freigeben
A trusted resource PEP checks the canonical request against current mission authority. A separate Vault decision determines whether a credential may be issued.|Ein vertrauenswürdiger Ressourcen-PEP prüft die normierte Anfrage gegen den aktuellen Auftrag. Vault entscheidet getrennt, ob Zugangsdaten ausgegeben werden dürfen.
Versioned mission and delegation|Versionierter Auftrag und Delegation
Decision|Entscheidung
Vault audience, RAR, lease|Vault-Empfänger, RAR und Lease
Native role and final policy check|Native Rolle und abschließende Richtlinienprüfung
**Connectivity note:** the resource PEP may be in a data-access service or embedded in the actual resource. Boundary is an optional transport control; it must not expose an alternative route that bypasses the resource PEP or database restrictions. For the database flow below, the connector and resource PEP are one trusted service, and its optional Boundary connection is used only after permit. The same pattern applies to Kafka and Astra DB, using their own credentials and downstream controls. Kafka topic RBAC/ACLs do not provide train-ID filtering; implement that in a trusted service or partitioned data design. Astra DB metadata filters are not an authorization boundary on their own.|**Verbindung:** Der Ressourcen-PEP kann im Zugriffsdienst oder direkt in der Ressource sitzen. Boundary kann den Transport absichern und darf keinen Weg um PEP oder Datenbankregeln öffnen. Im Ablauf unten bilden Konnektor und PEP einen Dienst, der Boundary erst nach Freigabe nutzt. Kafka und Astra DB verwenden eigene Zugangsdaten und nachgelagerte Kontrollen. Kafka-Topic-Rollen und ACLs filtern nicht nach Zug-ID. Das muss ein vertrauenswürdiger Dienst oder das Datendesign leisten. Astra-DB-Metadatenfilter bilden für sich keine Autorisierungsgrenze.
Operations manager|Betriebsleitung
IBM Verify / OAuth issuer|IBM Verify oder OAuth-Aussteller
Trusted context PIP *|Vertrauenswürdiger Kontextdienst (PIP) *
Business PDP * - OPA and optional OpenFGA|Fachlicher PDP * mit OPA und optional OpenFGA
OpenShell Gateway and trusted supervisor|OpenShell-Gateway und vertrauenswürdiger Supervisor
Nova sandbox / MCP client|Nova-Sandbox und MCP-Client
agentgateway / MCP PEP|agentgateway als MCP-PEP
MCP server / trusted resource connector *|MCP-Server und vertrauenswürdiger Konnektor *
Vault Enterprise - Registry / OAuth / RAR|Vault Enterprise mit Registry, OAuth und RAR
Boundary - optional controlled database path|Boundary als optionaler Datenbank-Zugangsweg
Resource PEP * - canonical request / final check|Ressourcen-PEP * für tatsächliche Anfrage und Abschlussprüfung
Confluent Kafka operational topic|Betriebs-Topic in Confluent Kafka
PostgreSQL approved read-only view|Freigegebene PostgreSQL-Leseansicht
DataStax Astra DB - approved retrieval / memory|DataStax Astra DB für erlaubte Suche und Speicher
CRM / maintenance API|CRM- und Wartungs-API
Protected payment / personal data|Geschützte Zahlungs- und Personendaten
OTel / Vault audit / Confluent security events|OTel, Vault-Audit und Confluent-Sicherheitsereignisse
Scope expansion, credential broker and actual resource read|Erweiterung, Zugangsdatenvermittlung und tatsächlicher Lesezugriff
Nova / OpenShell|Nova in OpenShell
Connector / resource PEP *|Konnektor und Ressourcen-PEP *
Mission Authority *|Auftragsstelle *
Business PDP + PIP *|Fachlicher PDP und PIP *
DB / Kafka / Astra resource|Datenbank, Kafka oder Astra als Ressource
Vault credential issuance here uses the delegated OAuth/RAR profile. The autonomous alternative uses agent baseline ACLs and applicable token constraints, or a configured workload authentication path with narrowly scoped Vault roles. Do not concatenate SPIFFE login, MCP bearer token and Vault-audience OBO token into one interchangeable credential.|Vault verwendet hier das delegierte OAuth-/RAR-Profil. Autonom sind Grundrechte des Agenten und passende Token-Grenzen oder eine eingerichtete Workload-Anmeldung mit engen Vault-Rollen möglich. SPIFFE-Anmeldung, MCP-Bearer-Token und Vault-OBO-Token bleiben getrennte Nachweise.
Approve investigation M-204 with public research scope|M-204 mit öffentlicher Recherche genehmigen
Request operational incident records for RE-204|Betriebsdaten zur Störung RE-204 anfragen
Validate MCP token and forward actual arguments|MCP-Token prüfen und tatsächliche Argumente weiterleiten
Evaluate canonical read, train ID, time window, actor and mission|Normierten Lesezugriff, Zug, Zeitfenster, Akteur und Auftrag prüfen
Read current scope and generation|Aktuellen Umfang und Generation abrufen
Internal source not in approved scope|Interne Quelle liegt außerhalb des erlaubten Umfangs
Deny / additional authorization required|Abgelehnt. Zusätzliche Freigabe nötig.
Access requires scope change|Zugriff braucht eine Auftragsänderung
Request read-only operational data extension via approved route|Zusätzlichen Lesezugriff auf Betriebsdaten über den erlaubten Weg anfragen
Request additional authority|Zusätzliche Befugnis anfragen
Approve RE-204 operational data only|Nur Betriebsdaten zu RE-204 zulassen
Advance mission version; invalidate superseded grants|Auftragsversion erhöhen und alte Freigaben ungültig machen
Retry the permitted read|Erlaubten Lesezugriff wiederholen
Forward authenticated actual request|Authentifizierte tatsächliche Anfrage weiterleiten
Submit canonical request and verified identity evidence|Normierte Anfrage und bestätigte Identität einreichen
Read current mission and resource attributes via PIP|Aktuelle Auftrags- und Ressourcenattribute über den PIP abrufen
Short-lived bound permit for this read|Kurzlebige gebundene Freigabe für diesen Lesezugriff
Request Vault-audience OBO token with RAR for credential role|Vault-OBO-Token mit RAR für die Zugangsdatenrolle anfragen
Signed Vault-audience token|Signiertes Token für Vault
Request dynamic credential under configured role|Dynamische Zugangsdaten für die eingerichtete Rolle anfragen
Validate issuer, audience, lifetime, actor registry, ACL, ceiling and RAR|Aussteller, Empfänger, Laufzeit, Akteurregister, ACL, Obergrenze und RAR prüfen
Vault denies|Vault lehnt ab
No credential issued|Keine Zugangsdaten ausgegeben
Resource call not executed|Ressourcenaufruf bleibt aus
Vault permits|Vault erlaubt
Lease and scoped backend credential|Lease und begrenzte Backend-Zugangsdaten
Recheck decision bindings, current mission and actual parameters|Entscheidungsbindung, aktuellen Auftrag und Parameter erneut prüfen
Execute allowed read with backend credential (optional Boundary path)|Erlaubten Lesezugriff mit Backend-Zugangsdaten ausführen, optional über Boundary
Enforce native role, view or topic authorization|Native Rollen-, Ansichts- oder Topic-Rechte durchsetzen
Permitted records only|Nur erlaubte Datensätze
Filtered response and provenance via gateway|Gefilterte Antwort und Herkunft über das Gateway
Record execution outcome and correlate lease / decision|Ergebnis erfassen und Lease mit Entscheidung verknüpfen
Cross-mission access, expiry and closure|Getrennte Aufträge, Ablauf und Zugriffsende
Resource PEP / memory service *|Ressourcen-PEP und Speicherdienst *
Business PDP *|Fachlicher PDP *
Mission registry *|Auftragsregister *
Backend / session controller|Backend und Sitzungssteuerung
**Verification:** successful operation depends on both business authorization and credential authorization. The resource PEP rejects changed train IDs, unauthorized operation, stale mission version, invalid audience, cross-mission memory and expired or revoked access. No direct resource route from the sandbox exists.|**Prüfung:** Ein erfolgreicher Vorgang braucht sowohl fachliche Freigabe als auch erlaubte Zugangsdaten. Der Ressourcen-PEP weist andere Züge, unerlaubte Aktionen, alte Aufträge, falsche Token-Empfänger, fremde Speicher und abgelaufene oder widerrufene Zugänge ab. Die Sandbox hat keinen direkten Ressourcenweg.
Use M-204 authorization while executing M-105|Freigabe von M-204 während M-105 verwenden
Submit actual mission and credential binding|Tatsächlichen Auftrag und Bindung der Zugangsdaten melden
Read current mission scope and generation|Aktuellen Auftragsumfang und Generation abrufen
M-105 does not include M-204 data|M-105 umfasst keine Daten von M-204
Deny mismatch|Abweichung ablehnen
No data returned|Keine Daten zurückgegeben
Read memory namespace for M-204 under M-105|Speicherbereich von M-204 unter M-105 lesen
Deny cross-mission access|Zugriff auf den anderen Auftrag verweigern
Mark M-204 completed, prevent new grants|M-204 abschließen und neue Freigaben sperren
Revoke associated revocable leases via response adapter *|Widerrufbare zugehörige Leases über Reaktionsadapter widerrufen *
Close active backend session where supported|Aktive Backend-Sitzung beenden, soweit unterstützt
Invalidate M-204 decision and storage grants|Entscheidung und Speicherfreigaben von M-204 ungültig machen
Report verified closure or incomplete coverage|Bestätigte Sperrung oder lückenhafte Abdeckung melden
M-105 remains active; no blanket revocation of unrelated missions|M-105 bleibt aktiv. Unabhängige Aufträge bleiben erhalten.
`);
 pairs(`
Keep autonomy bounded as risk changes.|Autonomie bei wechselndem Risiko begrenzen
Extend the same request path to specialist agents, exact human approvals, event-driven missions and independently verified containment.|Erweitere denselben Anfrageweg um Spezialagenten, genaue menschliche Freigaben, ereignisgesteuerte Aufträge und unabhängig bestätigte Eindämmung.
Child mission and shared budget|Teilauftrag und gemeinsames Budget
Execution|Ausführung
Commit-time decision and idempotency|Prüfung bei der Ausführung und Idempotenz
Signals|Signale
Response|Reaktion
Suspend, revoke, retest and recover|Sperren, widerrufen, prüfen und wieder freigeben
The runtime, identity service, mission registry, Vault and backend are independently administered trust boundaries. The response controller never treats Kafka event publication as proof that remediation succeeded. OpenID SSF/CAEP may carry risk or revocation signals where supported; they do not by themselves terminate a database connection or cancel a queued business operation.|Laufzeit, Identitätsdienst, Auftragsregister, Vault und Backend haben getrennte Zuständigkeiten. Ein veröffentlichtes Kafka-Ereignis belegt keine erfolgreiche Reaktion. OpenID SSF und CAEP können bei entsprechender Unterstützung Risiko- oder Widerrufssignale übertragen. Datenbankverbindungen oder wartende Vorgänge müssen die zuständigen Dienste selbst beenden.
Mission Authority / parent and child grants *|Auftragsstelle für Haupt- und Teilaufträge *
Authoritative PIP *|Verlässlicher Attributdienst (PIP) *
Business PDP * - OPA / OpenFGA|Fachlicher PDP * mit OPA oder OpenFGA
Human approval / immutable intent *|Menschliche Freigabe und unveränderliche Absicht *
watsonx Orchestrate / mission launch *|watsonx Orchestrate und Auftragsstart *
OpenShell Gateway and trusted supervisors|OpenShell-Gateway und vertrauenswürdige Supervisoren
Mira sandbox - separate identity|Mira-Sandbox mit eigener Identität
SPIRE / workload identity|SPIRE und Workload-Identität
agentgateway - model, MCP and A2A PEP|agentgateway als Modell-, MCP- und A2A-PEP
Delegation and budget service *|Delegations- und Budgetdienst *
Resource PEP / connector *|Ressourcen-PEP und Konnektor *
Confluent operational events|Confluent-Betriebsereignisse
PostgreSQL / Boundary optional|PostgreSQL mit optionalem Boundary
Astra DB retrieval and isolated memory|Astra-DB-Suche und getrennter Speicher
Maintenance / CRM API|Wartungs- und CRM-API
Artifact and delivery service *|Datei- und Versanddienst *
Granite / approved models|Granite und freigegebene Modelle
Confluent Flink / event correlation|Confluent Flink und Ereigniskorrelation
OTel / OCSF normalization *|OTel und OCSF-Normalisierung *
Confluent security event topics|Confluent-Topics für Sicherheitsereignisse
Flink risk correlation *|Flink-Risikokorrelation *
Response controller and adapters *|Reaktionssteuerung und Adapter *
Protected audit evidence store *|Geschützter Speicher für Auditbelege *
Event-triggered mission and scoped A2A delegation|Ereignisgesteuerter Auftrag und begrenzte A2A-Delegation
Confluent operational topic|Betriebs-Topic in Confluent
Flink / trusted trigger service *|Flink und vertrauenswürdiger Auslösedienst *
Orchestrator / OpenShell|Orchestrierung und OpenShell
Delegation PDP / budget service *|Delegations-PDP und Budgetdienst *
A2A gateway|A2A-Gateway
Resource PEP / storage service *|Ressourcen-PEP und Speicherdienst *
Operational events for RE-204|Betriebsereignisse für RE-204
Validated incident trigger under standing authority|Geprüfter Auslöser unter bestehender Befugnis
Check trigger identity, policy, deduplication and budget|Identität, Richtlinie, Duplikate und Budget prüfen
Create approved parent mission M-304|Freigegebenen Hauptauftrag M-304 anlegen
Launch or assign authorized work|Erlaubte Arbeit starten oder zuweisen
Delegate technical analysis of approved report excerpt|Analyse des freigegebenen Ausschnitts übertragen
Verified actor and actual requested delegation|Geprüfter Akteur und tatsächlich beantragte Delegation
Fetch parent grant, Mira's ceiling and allowed data|Hauptauftrag, Miras Obergrenze und erlaubte Daten abrufen
Current parent mission and delegation rules|Aktueller Hauptauftrag und Delegationsregeln
Within parent authority and shared budget|Innerhalb von Hauptauftrag und gemeinsamem Budget
Register child mission M-304.1 with narrower scope and expiry|Teilauftrag M-304.1 mit engerem Umfang und Ablauf registrieren
Assign Mira using distinct identity and runtime|Mira mit eigener Identität und Laufzeit beauftragen
Deliver authorized child reference|Genehmigte Teilauftragsreferenz weitergeben
Request exact input artifact under child mission|Die genaue Eingabedatei unter dem Teilauftrag anfragen
Verify child grant and parent status|Teilfreigabe und Status des Hauptauftrags prüfen
Permit scoped read|Begrenzten Lesezugriff erlauben
Approved artifact excerpt only|Nur den erlaubten Dateiausschnitt
Return analysis and provenance|Analyse und Herkunft zurückgeben
Validated result|Geprüftes Ergebnis
Close child grant after completion|Teilfreigabe nach Abschluss schließen
Outside scope or aggregate budget exhausted|Außerhalb des Auftrags oder gemeinsames Budget aufgebraucht
Deny delegation|Delegation ablehnen
No child mission created|Kein Teilauftrag angelegt
Mira cannot inherit Nova's credential or use unrelated standing authority for this child task|Mira verwendet für diesen Teilauftrag weder Novas Zugangsdaten noch Rechte aus anderen Aufgaben
Injection and parameter-level authorization|Eingeschleuste Anweisung und Prüfung der konkreten Parameter
RAG / external document|RAG und externes Dokument
Resource PEP *|Ressourcen-PEP *
Mission registry / PIP *|Auftragsregister und PIP *
CRM / finance system|CRM und Finanzsystem
Security event pipeline|Verarbeitung der Sicherheitsereignisse
Retrieved content includes unauthorized instruction|Abgerufener Inhalt enthält eine unerlaubte Anweisung
Retrieved text is untrusted data, not mission authority|Abgerufener Text liefert Daten und kann keinen Auftrag erteilen
Call approved tool with payment data parameters|Erlaubtes Werkzeug mit Zahlungsdatenparametern aufrufen
Forward validated call for actual business decision|Geprüften Aufruf zur fachlichen Entscheidung weiterleiten
Canonical operation, record IDs, destination, actor, mission|Normierte Aktion, Datensatz-IDs, Ziel, Akteur und Auftrag
Fetch authoritative scope, hard rules and current risk|Verlässlichen Umfang, feste Regeln und aktuelles Risiko abrufen
Financial data is prohibited for this mission|Finanzdaten sind für diesen Auftrag gesperrt
Deny|Ablehnen
Access refused before protected data is returned|Zugriff verweigert, bevor geschützte Daten ausgegeben werden
Denial and actual request evidence|Beleg für Ablehnung und tatsächliche Anfrage
No business effect occurs on denied route|Die abgelehnte Anfrage hat keine fachliche Wirkung
Call createMaintenanceTicket for RE-204|createMaintenanceTicket für RE-204 aufrufen
Forward actual request|Tatsächliche Anfrage weiterleiten
Evaluate allowed asset, action and priority|Erlaubtes Fahrzeug, Aktion und Priorität prüfen
Permit with bindings and limited validity|Gebundene Freigabe mit kurzer Gültigkeit
Revalidate at commit and execute authorized ticket creation|Bei der Ausführung erneut prüfen und erlaubtes Ticket anlegen
Ticket ID and actual outcome|Ticket-ID und tatsächliches Ergebnis
Execution receipt|Ausführungsbeleg
Correlated permit and outcome|Freigabe und Ergebnis verknüpft
Exact approval, commit-time check and idempotency|Genaue Freigabe, Prüfung bei Ausführung und Idempotenz
Authorized human reviewer|Berechtigte prüfende Person
Delivery / business resource PEP *|Versand- und Fachressourcen-PEP *
Approval service / Verify *|Freigabedienst und Verify *
Downstream resource|Nachgelagerte Ressource
Use resource-owned transactional semantics where possible. An external SaaS without a final authorization interface or idempotency support leaves a residual race or duplicate-effect risk. Do not claim distributed exactly-once delivery merely because Kafka is used.|Wo möglich, sollte die Ressource selbst die Transaktion absichern. Bei externem SaaS ohne Abschlussprüfung oder Idempotenz bleiben Zeitfenster und doppelte Wirkungen möglich. Kafka allein belegt keine verteilte Genau-einmal-Zustellung.
Propose report delivery to authorized recipient|Versand an den erlaubten Empfänger vorschlagen
Canonicalize file digest, recipient, operation and intent ID|Datei-Hash, Empfänger, Aktion und Absichts-ID normieren
Request approval for immutable transaction preview|Freigabe für eine unveränderliche Vorschau anfragen
Authenticate reviewer and show exact action|Prüfperson anmelden und genaue Aktion anzeigen
Approve exact revision and destination|Genaue Fassung und Ziel freigeben
Single-use approval reference with expiry and bindings|Einmalige Freigabereferenz mit Ablauf und Bindungen
Submit action for execution|Aktion zur Ausführung einreichen
Actual digest, recipient, operation, approval and mission version|Tatsächlicher Hash, Empfänger, Aktion, Freigabe und Auftragsversion
Check current grant and session generation|Aktuelle Freigabe und Sitzungsgeneration prüfen
Modified action or stale / suspended grant|Geänderte Aktion oder alte beziehungsweise gesperrte Freigabe
Deny, require fresh approval or reauthorization|Ablehnen und eine neue Freigabe verlangen
No delivery or business effect|Keine Zustellung und keine fachliche Ausführung
Current and approved|Aktuell und genehmigt
Bound permit|Gebundene Freigabe
Commit-time validation and durable single-use intent|Prüfung bei Ausführung und dauerhaft erfasste Einmalabsicht
Execute with idempotency key|Mit Idempotenzschlüssel ausführen
Actual effect or ambiguous outcome|Tatsächliche Wirkung oder ungeklärtes Ergebnis
Persist receipt or reconcile unknown outcome before retry|Beleg speichern oder unklaren Ausgang vor erneutem Versuch abgleichen
Final status / pending reconciliation|Endstatus oder ausstehender Abgleich
Continuous risk, cascading revocation and recovery|Laufende Risikoprüfung, kaskadierender Widerruf und Wiederfreigabe
Runtime / PEP / Vault sensors|Sensoren an Laufzeit, PEP und Vault
Confluent security topics|Confluent-Sicherheits-Topics
SOC / authorized response controller *|SOC und berechtigte Reaktionssteuerung *
Resource PEP / backend controllers|Ressourcen-PEP und Backend-Steuerungen
**Verification:** prove permit and deny cases with resource receipts, child-grant limits, aggregate budget, tampered artifact denial, stale approval rejection, idempotency, outage behaviour, revoked lease/session retest and independently collected audit. A completed external action cannot be undone simply by suspending the agent.|**Prüfung:** Erlaubnis und Ablehnung mit Ressourcenbelegen nachweisen. Grenzen der Teilaufträge, Budget, manipulierte Dateien, alte Freigaben, Idempotenz, Ausfälle, erneute Tests widerrufener Sitzungen und unabhängige Audits prüfen. Bereits ausgeführte externe Vorgänge bleiben auch nach einer Agentensperre bestehen.
Denials, credential events, actual effects and runtime evidence|Ablehnungen, Zugangsereignisse, tatsächliche Wirkungen und Laufzeitbelege
Correlated event stream|Verknüpfter Ereignisstrom
Risk signal with mission, identity, severity and evidence|Risikosignal mit Auftrag, Identität, Schweregrad und Beleg
Validate event and response policy; deduplicate|Ereignis und Reaktionsregel prüfen, Duplikate entfernen
Suspend affected mission and linked child grants|Betroffenen Auftrag und zugehörige Teilfreigaben sperren
Current generation retired; new grants blocked|Aktuelle Generation beendet, neue Freigaben gesperrt
Identity / delegation control|Kontrolle von Identität und Delegation
Suspend relevant authorization or identity where supported|Betroffene Erlaubnis oder Identität sperren, soweit unterstützt
Acknowledgement or unsupported status|Bestätigung oder Meldung fehlender Unterstützung
Credential control|Zugangsdatenkontrolle
Revoke associated leases / disable affected credential path|Zugehörige Leases widerrufen oder den betroffenen Zugang sperren
Revocation result|Widerrufsergebnis
Runtime control|Laufzeitkontrolle
Stop or quarantine affected sandbox generation|Betroffene Sandbox-Generation stoppen oder isolieren
Runtime status|Laufzeitstatus
Downstream control|Nachgelagerte Kontrolle
Reject new calls, close sessions, cancel waiting work and child access|Neue Aufrufe ablehnen, Sitzungen schließen, wartende Vorgänge und Teilzugriffe beenden
Per-resource results|Ergebnis je Ressource
Independently retest old routes and inspect pending operations|Alte Wege unabhängig erneut prüfen und wartende Vorgänge untersuchen
All required paths verified closed|Alle nötigen Wege nachweislich geschlossen
Verified containment for tested scope|Eindämmung für geprüften Umfang bestätigt
Any path still active or unreachable|Ein Weg ist noch aktiv oder nicht erreichbar
Partial / unverified containment; continue escalation|Eindämmung teilweise oder unbestätigt, weiter eskalieren
Preserve evidence and investigate actual effects|Belege bewahren und tatsächliche Wirkungen prüfen
Authorized recovery after remediation and fresh policy evaluation|Wiederfreigabe nach Behebung und erneuter Richtlinienprüfung
New bounded mission generation / admitted runtime|Neue begrenzte Auftragsgeneration und zugelassene Laufzeit
Old tokens, approvals and child grants are not reused; unrelated missions stay active where safe|Alte Token, Freigaben und Teilaufträge bleiben geschlossen. Unabhängige Aufgaben laufen weiter, sofern sicher.
`);
 pairs(`
Human delegation and OAuth token exchange|Menschlicher Auftrag und OAuth-Tokenaustausch
Operations Manager|Betriebsleitung
Configured OAuth issuer|Eingerichteter OAuth-Aussteller
Mission authority *|Auftragsstelle *
Trusted connector *|Vertrauenswürdiger Konnektor *
Authenticate as the Operations manager|Als Betriebsleitung anmelden
Request the RE-204 investigation and exact scope|Untersuchung zu RE-204 mit genauem Umfang anfragen
Verify issuer authority and record the current bounded delegation|Befugnis des Auftraggebers prüfen und begrenzten Auftrag erfassen
Request an approved exchange with subject and agent actor evidence|Erlaubten Tokenaustausch mit Nachweisen für Subjekt und Agent anfragen
Issue access token for the specific resource PEP|Zugriffstoken für den konkreten Ressourcen-PEP ausstellen
Present resource-audience token with the actual request|Token für die Ressource mit der tatsächlichen Anfrage vorlegen
Request a separate token for the Vault endpoint|Eigenes Token für den Vault-Endpunkt anfragen
Issue separately scoped Vault-audience token|Separat begrenztes Token für Vault ausstellen
Present Vault-audience token with configured authorization details|Vault-Token mit eingerichteten Autorisierungsdetails vorlegen
Return the independent Vault decision|Unabhängige Vault-Entscheidung zurückgeben
The issuer checks its configured trust and delegation. RFC 8693 carries delegation context; it does not decide permission to use the database. Vault and the resource validate their own audience and policy.|Der Aussteller prüft eingerichtetes Vertrauen und Delegation. RFC 8693 überträgt den Delegationskontext. Datenbankzugriff braucht eine separate Entscheidung. Vault und Ressource prüfen jeweils die eigene Zielbindung und Richtlinie.
Authorization of actual resource parameters|Autorisierung der tatsächlichen Ressourcenparameter
Trusted PIP *|Vertrauenswürdiger PIP *
Kafka access service / broker|Kafka-Zugriffsdienst und Broker
Request operational events|Betriebsereignisse anfragen
Forward authenticated request to the permitted tool route|Authentifizierte Anfrage an den erlaubten Werkzeugweg weiterleiten
Observe the actual asset, window, operation and resource|Tatsächliches Fahrzeug, Zeitfenster, Aktion und Ressource erfassen
Request a decision for the canonical request|Entscheidung für die normierte Anfrage einholen
Fetch current mission scope and resource attributes|Aktuellen Auftragsumfang und Ressourcenattribute abrufen
Return the authoritative grant and classification|Verlässliche Freigabe und Einstufung zurückgeben
Return the Boolean decision for this exact evaluation|Ja- oder Nein-Entscheidung für diese Prüfung zurückgeben
For a permit, use the configured topic route and enforce the RE-204 time window|Bei Erlaubnis den eingerichteten Topic-Weg nutzen und das Zeitfenster für RE-204 durchsetzen
Return records filtered to the allowed asset and time window|Datensätze für das erlaubte Fahrzeug und Zeitfenster zurückgeben
Return scoped rows or refuse a request outside the grant|Erlaubte Zeilen zurückgeben oder unzulässige Anfrage ablehnen
Relay the authorized result or refusal|Erlaubtes Ergebnis oder Ablehnung weitergeben
Kafka topic authorization and application record filtering are separate controls. AuthZEN 1.0 can carry the evaluation and Boolean decision. The application still owns mission currency, enforcement and any richer workflow.|Kafka-Topic-Rechte und Datensatzfilter sind getrennt. AuthZEN 1.0 kann Prüfanfrage und Ja- oder Nein-Entscheidung übertragen. Auftragsgültigkeit, Durchsetzung und weitergehende Abläufe verantwortet die Anwendung.
Event-triggered mission initiation|Auftragsstart durch ein Ereignis
Flink event correlation|Flink-Ereigniskorrelation
Launch workflow *|Startablauf *
Nova runtime|Nova-Laufzeit
Deliver configured door-warning and delay records|Eingerichtete Meldungen zu Türwarnung und Verspätung übermitteln
Submit RE-204 incident candidate with event references|Möglichen Vorfall zu RE-204 mit Ereignisreferenzen melden
Verify provenance, current standing policy and accountable owner|Herkunft, geltende Richtlinie und verantwortliche Stelle prüfen
Return current source trust and authority constraints|Aktuellen Vertrauensstatus der Quelle und Befugnisgrenzen zurückgeben
Record M-304 with routine read scope and expiry|M-304 mit üblichen Lesezugriffen und Ablauf erfassen
Request execution under the active bounded grant|Ausführung unter der begrenzten aktiven Freigabe anfragen
Launch or admit a verified runtime for the mission|Geprüfte Laufzeit für den Auftrag starten oder zulassen
A stream event can trigger evaluation. Mission authority comes from the current organizational policy and verified context.|Ein Stream-Ereignis kann die Prüfung auslösen. Die Auftragsbefugnis kommt aus der geltenden Unternehmensrichtlinie und dem geprüften Kontext.
A2A delegation, budget and child grant closure|A2A-Delegation, gemeinsames Budget und Ende des Teilauftrags
A2A receiving PEP *|Empfangender A2A-PEP *
Submit the technical package for analysis only|Technisches Paket nur zur Analyse einreichen
Request child scope and aggregate budget check|Umfang des Teilauftrags und gemeinsames Budget prüfen lassen
Read the current parent grant and delegation ceiling|Aktuellen Hauptauftrag und Delegationsobergrenze abrufen
Return allowed package-only scope|Berechtigung nur für das Paket zurückgeben
Register the child grant under the shared budget|Teilauftrag im gemeinsamen Budget erfassen
Authenticate Mira independently and forward the scoped task|Mira getrennt anmelden und begrenzten Auftrag weiterleiten
Return the analysis and evidence references|Analyse und Belegreferenzen zurückgeben
Complete the child grant and retire task access|Teilauftrag abschließen und seinen Zugriff beenden
A2A carries the task and result. The customer delegation service enforces the parent scope, lifecycle and shared budget.|A2A überträgt Aufgabe und Ergebnis. Der unternehmenseigene Delegationsdienst setzt Umfang des Hauptauftrags, Lebenszyklus und gemeinsames Budget durch.
Human approval and exact artifact delivery|Menschliche Freigabe und Versand der exakten Fassung
Operations reviewer|Prüfperson der Betriebsleitung
Configured IBM Verify CIBA|Eingerichtetes IBM Verify CIBA
Approval service *|Freigabedienst *
Delivery PEP *|Versand-PEP *
Operations inbox|Postfach der Betriebsleitung
Start reviewer authentication on a separate device|Anmeldung der Prüfperson auf einem anderen Gerät anstoßen
Ask the named reviewer to authenticate|Benannte Person zur Anmeldung auffordern
Return the configured authentication result|Ergebnis der eingerichteten Anmeldung zurückgeben
Approve the exact artifact digest, action and Operations inbox|Genauen Datei-Hash, Aktion und Betriebspostfach freigeben
Store an application approval bound to that copy and mission version|Freigabe an diese Fassung und Auftragsversion binden und speichern
Verify the decision is current immediately before release|Entscheidung unmittelbar vor dem Versand erneut prüfen
Compare the actual copy and destination with the approval|Tatsächliche Fassung und Ziel mit der Freigabe abgleichen
Deliver only if the comparison and current authorization pass|Nur bei Übereinstimmung und aktueller Erlaubnis zustellen
Return the delivery receipt|Zustellbeleg zurückgeben
CIBA provides decoupled authentication. An edited copy requires its own authorization under the application contract. A previous receipt survives later revocation.|CIBA ermöglicht die Anmeldung an einem separaten Gerät. Eine geänderte Fassung braucht nach den Anwendungsregeln eine eigene Freigabe. Ein vorhandener Beleg bleibt auch nach Widerruf erhalten.
Incident investigation and selective recovery|Untersuchung und gezielte Wiederfreigabe
Security Operations|Sicherheitsbetrieb
Response controller *|Reaktionssteuerung *
Protected evidence store *|Geschützter Belegspeicher *
Resource PEPs *|Ressourcen-PEPs *
Runtime admission *|Laufzeitzulassung *
Correlate independent runtime, Vault, resource and delivery records|Unabhängige Protokolle aus Laufzeit, Vault, Ressource und Versand verknüpfen
Verify affected resource routes and effects|Betroffene Ressourcenwege und Wirkungen prüfen
Return acknowledgements or an explicit unverified status|Bestätigungen oder ausdrücklich unbestätigten Status zurückgeben
Escalate incomplete containment and keep the mission suspended|Unvollständige Eindämmung eskalieren und Auftrag gesperrt lassen
Request narrowly scoped recovery after the required confirmations|Nach den nötigen Bestätigungen begrenzte Wiederfreigabe anfragen
Review the incident and issue a fresh mission version|Vorfall prüfen und neue Auftragsversion ausstellen
Require fresh workload identity and posture evidence|Neue Nachweise für Workload-Identität und Zustand verlangen
Report the new admitted generation|Neu zugelassene Generation melden
Preserve prior commits and quarantined evidence|Ausgeführte Vorgänge und Quarantänebelege bewahren
Recovery needs current authority and an independently verified new runtime. Old permits remain invalid. Completed business effects remain part of the incident record.|Wiederfreigabe braucht aktuelle Befugnis und eine unabhängig geprüfte neue Laufzeit. Alte Freigaben bleiben ungültig. Abgeschlossene Vorgänge bleiben in der Vorfallakte.
Evidence has limited reach|Belege decken nur einen Teil ab
Discovery cannot prove every external instance is visible.|Die Erkennung belegt nicht, dass alle externen Instanzen sichtbar sind.
An uncontrolled access path remains|Ein unkontrollierter Zugangsweg bleibt offen
Existing user credentials may allow Nova to access systems until the resource owner intervenes.|Bestehende Nutzerzugänge können Nova Zugriff geben, bis die zuständige Stelle eingreift.
Provider credentials stay outside Nova|Anbieter-Zugangsdaten bleiben außerhalb von Nova
The trusted supervisor and gateway mediate approved traffic.|Der vertrauenswürdige Supervisor und das Gateway vermitteln erlaubte Verbindungen.
Registration is insufficient|Registrierung allein reicht nicht
Workload identity is not proof of runtime integrity or authorization for a business action.|Die Workload-Identität belegt weder den Laufzeitzustand noch die Freigabe einer Aktion.
Two independent decisions|Zwei getrennte Entscheidungen
The resource PEP enforces business authority; Vault independently decides credential access.|Der Ressourcen-PEP setzt die fachliche Befugnis durch. Vault entscheidet unabhängig über Zugangsdaten.
A lease is not business authorization|Die Lease ersetzt die fachliche Freigabe nicht
Native backend roles and exact request checks are required even after issuance.|Auch nach der Ausgabe bleiben Backend-Rollen und die Prüfung der tatsächlichen Anfrage erforderlich.
Containment must be verified|Eindämmung braucht Bestätigung
Suspend the mission, revoke access and confirm each required path is closed.|Auftrag sperren, Zugriff widerrufen und jeden betroffenen Weg prüfen.
A signal is not a receipt|Ein Signal ersetzt keinen Beleg
Unavailable downstream controllers leave containment unverified; completed actions remain completed.|Wenn nachgelagerte Stellen nicht erreichbar sind, bleibt die Eindämmung unbestätigt. Abgeschlossene Aktionen bleiben bestehen.
Runtime / egress|Laufzeit und ausgehende Verbindungen
Mission / PDP|Auftrag und PDP
Vault credentials|Vault-Zugangsdaten
Resource PEP|Ressourcen-PEP
Approval / delegation|Freigabe und Delegation
Scans supported sources for exposed secrets. Discovery is not revocation.|Durchsucht unterstützte Quellen nach offengelegten Geheimnissen. Der Fund allein widerruft nichts.
Independent credential authority: validates the configured identity or Vault-audience token, local ACLs, ceilings and applicable RAR. Issues or revokes supported credentials; business data authorization remains with the resource.|Unabhängige Stelle für Zugangsdaten. Prüft Identität oder Vault-Token, lokale ACLs, Obergrenzen und RAR. Stellt unterstützte Zugänge aus oder widerruft sie. Die Ressource entscheidet über die Geschäftsdaten.
Authenticates human or workload context and, when configured, performs token exchange. Separate audience-bound access tokens must be validated by their intended recipients.|Prüft die menschliche oder Workload-Identität und kann bei entsprechender Einrichtung Token austauschen. Jeder Zielservice prüft das für ihn vorgesehene Token.
Owns agent registration, owner and lifecycle context. The logical identity must be linked to trusted runtime evidence.|Verwaltet Agentenregistrierung, Verantwortung und Lebenszyklus. Die Agentenidentität muss mit verlässlichen Laufzeitnachweisen verknüpft sein.
Customer-owned authoritative task record: issuer, subject, actor, resource/action scope, expiry, version and state. Agent-generated text cannot change the record.|Verlässlicher Auftragseintrag des Unternehmens mit Aussteller, Subjekt, Akteur, Ressourcen- und Aktionsgrenzen, Ablauf, Version und Status. Vom Agenten erzeugter Text darf ihn nicht ändern.
Customer integration retrieving authoritative mission, identity, resource and policy attributes. It does not accept agent assertions as proof.|Unternehmenseigene Integration, die verlässliche Attribute zu Auftrag, Identität, Ressource und Richtlinie abruft. Aussagen des Agenten gelten nicht als Nachweis.
Proposed business policy decision service, using OPA and optionally OpenFGA. Evaluates canonical operation and parameters, returns a bound decision to the trusted PEP.|Vorgeschlagener fachlicher Richtliniendienst mit OPA und optional OpenFGA. Prüft die normierte Aktion und ihre Parameter und liefert dem vertrauenswürdigen PEP eine gebundene Entscheidung.
Trusted runtime mediator. OpenShell controls sandbox access to approved paths; native session credentials are distinct from model, MCP and Vault tokens.|Vertrauenswürdige Laufzeitvermittlung. OpenShell beschränkt die Sandbox auf erlaubte Wege. Native Sitzungsnachweise bleiben getrennt von Modell-, MCP- und Vault-Tokens.
Authorizes runtime lifecycle operations and provisions sandbox generations through the selected compute driver. External mission-aware provider admission requires integration.|Erlaubt Laufzeitoperationen und stellt Sandbox-Generationen über den gewählten Treiber bereit. Eine externe auftragsbezogene Anbieterzulassung braucht eine Integration.
Provides verifiable workload identity (SPIFFE SVID). This is distinct from logical agent registration, mission authorization and measured runtime integrity.|Liefert eine prüfbare Workload-Identität (SPIFFE SVID). Agentenregister, Auftragsfreigabe und gemessene Laufzeitintegrität bleiben getrennt.
Customer-owned binding of logical agent, verified workload, expected sandbox generation and mission. Deny protected provider release on mismatch.|Unternehmenseigene Bindung von Agentenidentität, geprüftem Workload, erwarteter Sandbox-Generation und Auftrag. Bei Abweichung werden Anbieter-Zugangsdaten verweigert.
Configured transport and tool enforcement. Validate the endpoint audience, tool and request; authenticate the next service hop separately. DataPower Interact Gateway is the IBM option; agentgateway is an open-source alternative.|Eingerichtete Prüfung von Transport und Werkzeug. Token-Empfänger, Werkzeug und Anfrage prüfen, dann den nächsten Dienst separat anmelden. DataPower Interact Gateway ist die IBM-Option, agentgateway eine Open-Source-Alternative.
Trusted resource-side enforcement observes the actual request, obtains a bound PDP decision, and checks current authority before execution. Connector holds any backend credentials in trusted custody.|Die vertrauenswürdige Stelle an der Ressource sieht die Anfrage, holt eine gebundene PDP-Entscheidung und prüft ihre Gültigkeit vor Ausführung. Backend-Zugangsdaten bleiben beim Konnektor.
Governed retrieval or storage through a mission-aware service. Enforce collection/document filters, namespace access, provenance and approved output release; these are integration requirements.|Kontrollierter Zugriff über einen auftragsbezogenen Dienst. Filter, Speicherbereiche, Herkunft und Freigabe der Ausgabe sind Teil der Integration.
Transports operational or security events. Native topic ACLs are independent of record-level filtering, which requires a service or topic separation.|Transportiert Betriebs- oder Sicherheitsereignisse. Topic-ACLs sind von Datensatzfiltern getrennt. Für Filter braucht es einen Dienst oder getrennte Topics.
Correlates streams or derives candidate risk and mission triggers. A trusted authority validates the trigger before creating a grant or taking action.|Verknüpft Streams und leitet mögliche Risiko- oder Auftragssignale ab. Eine vertrauenswürdige Stelle prüft den Auslöser vor Freigabe oder Aktion.
Independent evidence, detection and response. Authenticate event sources, correlate request and decision IDs, preserve audit records and verify downstream containment.|Unabhängige Belege, Erkennung und Reaktion. Ereignisquellen prüfen, Anfrage- und Entscheidungs-IDs verbinden, Aufzeichnungen bewahren und Sperrungen bei nachgelagerten Diensten bestätigen.
Bind human approval to an exact action, content digest, recipient, mission generation and expiry. Revalidate at commit.|Die menschliche Freigabe an Aktion, Hash, Empfänger, Auftragsgeneration und Ablauf binden. Bei Ausführung erneut prüfen.
Separate agent instance. Its requests are untrusted until verified and authorized independently of model reasoning.|Eigenständige Agenteninstanz. Ihre Anfragen brauchen eine Prüfung und Freigabe unabhängig von der Modellbegründung.
Controls connectivity and session access where configured. Native database policy and business PEP remain required.|Steuert bei passender Einrichtung Verbindungen und Sitzungen. Native Datenbankregeln und fachliche Durchsetzung bleiben nötig.
Inspect the connected interfaces and enforce the controls at the owning service. This node is part of the illustrative reference deployment.|Prüfe die verbundenen Schnittstellen und setze Regeln beim zuständigen Dienst durch. Die Komponente ist Teil der beispielhaften Architektur.
Architecture component|Architekturkomponente
See the detailed topology and sequence contracts.|Siehe detaillierte Topologie und Schnittstellen im Ablauf.
Integration|Integration
No matching components.|Keine passenden Komponenten.
EXPOSED|OFFEN
no governed decision|keine gesteuerte Entscheidung
The request may execute using inherited credentials. Available enterprise sensors may detect it after the fact.|Die Anfrage kann mit übernommenen Zugangsdaten ausgeführt werden. Angebundene Sensoren können das im Nachhinein erkennen.
unverified request|ungeprüfte Anfrage
inherited credential|übernommene Zugangsdaten
resource-native permission only|nur eigene Rechte der Ressource
partial audit evidence|eingeschränkte Auditbelege
CONTROL GAP|KONTROLLLÜCKE
exposure|offener Zugang
Removed controls: {{1}}. Other enforcement points may still refuse the request.|Entfernte Kontrollen: {{1}}. Andere Prüfstellen können die Anfrage weiterhin abweisen.
request received|Anfrage empfangen
control unavailable: {{1}}|Kontrolle fehlt: {{1}}
downstream outcome not proven|Ergebnis am Ziel nicht nachgewiesen
DENY|ABGELEHNT
internal resource not published|interne Ressource nicht freigegeben
BUILD permits public research only. OpenShell and the approved gateway restrict Nova to published routes.|In Stufe 1 ist nur öffentliche Recherche erlaubt. OpenShell und das Gateway beschränken Nova auf freigegebene Wege.
verified identity|geprüfte Identität
admitted runtime|zugelassene Laufzeit
internal endpoint denied|interner Endpunkt abgelehnt
no credential issued|keine Zugangsdaten ausgegeben
PERMIT|ERLAUBT
scoped read|begrenzter Lesezugriff
The approved mission permits RE-204. Vault authorizes its own credential role; the resource PEP enforces actual parameters.|Der genehmigte Auftrag erlaubt RE-204. Vault prüft die Rolle für Zugangsdaten. Der Ressourcen-PEP prüft die tatsächlichen Parameter.
identity verified|Identität geprüft
current mission in scope|aktueller Auftrag passt
credential decision permit|Zugangsdaten erlaubt
resource read permit|Lesezugriff an der Ressource erlaubt
receipt recorded|Beleg erfasst
UNAVAILABLE|NICHT VERFÜGBAR
stage capability|Funktion dieser Stufe
This action is not supported at the selected maturity stage; continuous commit and child-mission checks are introduced in RESIST.|Diese Aktion gibt es in der gewählten Stufe noch nicht. Die Prüfung bei Ausführung und Teilaufträge kommen in Stufe 3 hinzu.
operation not published|Aktion nicht freigegeben
resource outside mission|Ressource außerhalb des Auftrags
recipient / content not authorized|Empfänger oder Inhalt nicht freigegeben
retired generation|alte Generation gesperrt
child scope exceeds parent|Teilauftrag geht über den Hauptauftrag hinaus
The independent enforcement point refuses the actual operation. A valid token does not override policy.|Die unabhängige Prüfstelle weist die tatsächliche Aktion ab. Ein gültiges Token ändert die Richtlinie nicht.
actual operation observed|tatsächliche Aktion erfasst
policy deny|Richtlinie lehnt ab
no authorized business effect|keine fachliche Ausführung
decision logged|Entscheidung protokolliert
`);
 pairs(`
A2A grant|A2A-Freigabe
Access audit|Zugriffsaudit
Active mission version and scope|Aktive Auftragsversion und Umfang
Actual business action|Tatsächliche Fachaktion
Actual effect and decision ID|Wirkung und Entscheidungs-ID
Actual tool request|Tatsächliche Werkzeuganfrage
Admit provider access|Anbieterzugang zulassen
Agent owner and lifecycle|Verantwortung und Lebenszyklus des Agenten
Agent status and ceiling context|Agentenstatus und Berechtigungsobergrenze
Alternative controlled connection after permit|Alternativer kontrollierter Zugang nach Freigabe
Approved HTTPS only|Nur erlaubtes HTTPS
Approved M-101 and launch grant|M-101 und Startfreigabe genehmigt
Approved credential to trusted provider adapter *|Erlaubte Zugangsdaten an den vertrauenswürdigen Anbieteradapter *
Approved data access|Erlaubter Datenzugriff
Approved launch / mission binding *|Erlaubter Start und Auftragsbindung *
Approved launch and delegation|Erlaubter Start und Delegation
Approved recipient only|Nur erlaubter Empfänger
Approved revision and recipient|Freigegebene Fassung und Empfänger
Attempted upload|Versuchter Upload
Audit events|Auditereignisse
AuthZEN-style decision request / bound result|Anfrage nach AuthZEN-Muster und gebundenes Ergebnis
Authoritative facts|Verlässliche Fakten
Authority and policy plane|Befugnisse und Richtlinien
Authorized operator request|Erlaubte Betreiberanfrage
Authorized response request|Erlaubte Reaktionsanfrage
Authorized tool invocation|Erlaubter Werkzeugaufruf
Business data and actions|Geschäftsdaten und Aktionen
Canonical operation / bound decision|Normierte Aktion und gebundene Entscheidung
Collection / document filters *|Sammlungs- und Dokumentenfilter *
Commit-time authorized action|Bei Ausführung genehmigte Aktion
Create child grant|Teilfreigabe erstellen
Credential decision and lease|Entscheidung über Zugangsdaten und Lease
Credential events|Zugangsereignisse
Credential role request|Anfrage an die Zugangsdatenrolle
Decision and actual outcome|Entscheidung und tatsächliches Ergebnis
Deny new requests and cancel queues|Neue Anfragen abweisen und Warteschlangen abbrechen
Direct permitted SQL path if configured|Erlaubter direkter SQL-Weg bei entsprechender Einrichtung
Disable sessions / permissions|Sitzungen und Rechte deaktivieren
Dynamic DB credential held by connector|Dynamische DB-Zugangsdaten beim Konnektor
Employee credential|Mitarbeiterzugang
Enforcement and credentials|Durchsetzung und Zugangsdaten
Enterprise resource zone|Zone für Unternehmensressourcen
Enterprise resources and resource PEPs|Unternehmensressourcen und ihre PEPs
Evidence plane|Belege
Exact artifact / action approval|Freigabe der konkreten Datei und Aktion
Excessive Kafka access|Zu weitreichender Kafka-Zugriff
External environment|Externe Umgebung
Findings|Funde
Gateway JWT over TLS|Gateway-JWT über TLS
Gateway and resource plane|Gateway und Ressourcen
Gateway decision|Gateway-Entscheidung
Identity and authority plane|Identitäten und Befugnisse
Identity and delegation|Identität und Delegation
Identity, authority and policy|Identität, Befugnis und Richtlinie
Inherits|Übernimmt
Instance identity evidence|Beleg der Instanzidentität
Investigate and request containment|Untersuchen und Eindämmung anfragen
MCP audience token / model requests|MCP-gebundenes Token und Modellanfragen
MCP token, mission ref and tool arguments|MCP-Token, Auftragsreferenz und Werkzeugparameter
Managed runtime -OpenShift or supported alternative|Verwaltete Laufzeit mit OpenShift oder unterstützter Alternative
Managed runtime - OpenShift or supported alternative|Verwaltete Laufzeit mit OpenShift oder unterstützter Alternative
Mediated HTTPS|Vermitteltes HTTPS
Mediated channel|Vermittelter Kanal
Mediated channel only|Nur vermittelter Kanal
Mission and expected instance|Auftrag und erwartete Instanz
Mission lifecycle|Auftragslebenszyklus
Mission versions, generation and hierarchy|Auftragsversionen, Generation und Hierarchie
Mission-filtered access|Nach Auftrag gefilterter Zugriff
Mission-scoped storage request|Speicheranfrage mit Auftragsbindung
Model request and quota check *|Modellanfrage und Kontingentprüfung *
Monitoring and governance|Überwachung und Verwaltung
OpenShift platform and trusted runtime control|OpenShift-Plattform und vertrauenswürdige Laufzeitsteuerung
Operational events|Betriebsereignisse
Optional authorized connectivity|Optionale erlaubte Verbindung
Parent ceiling and child action|Obergrenze des Hauptauftrags und Teilaktion
Policy and provider configuration|Richtlinie und Anbieterkonfiguration
Private authenticated mediation|Private authentifizierte Vermittlung
Private channel and bootstrap bundle|Privater Kanal und Startpaket
Process events if visible|Prozessereignisse, soweit sichtbar
Provision sandbox generation|Sandbox-Generation bereitstellen
Quota and payload policy|Regeln für Kontingent und Eingabe
Read filtered events|Gefilterte Ereignisse lesen
Reads / writes|Liest und schreibt
Remove principal access|Zugriff der Identität entziehen
Request separate Vault-audience OBO token|Eigenes Vault-OBO-Token anfragen
Resolved request and credential reference|Aufgelöste Anfrage und Zugangsreferenz
Retest outcomes / acknowledgements|Erneute Prüfergebnisse und Bestätigungen
Retire grant generation|Freigabegeneration schließen
Revoke child access and budgets|Teilzugriff und Budgets widerrufen
Revoke leases|Leases widerrufen
Runtime events|Laufzeitereignisse
SVID to approved workload / service|SVID für erlaubten Workload oder Dienst
Sandbox boundary -no direct network egress|Sandbox-Grenze ohne direkten Netzwerkzugang
Sandbox boundary - no direct network egress|Sandbox-Grenze ohne direkten Netzwerkzugang
Scoped A2A request|Begrenzte A2A-Anfrage
Scoped backend credential|Begrenzte Backend-Zugangsdaten
Separate Vault-audience token request|Eigenes Token für Vault anfragen
Separate mediated channel|Getrennter vermittelter Kanal
Stop process if managed|Verwalteten Prozess stoppen
Stop sandbox|Sandbox stoppen
Subject / actor and RAR token|Subjekt, Akteur und RAR-Token
Suspend identity / mission|Identität oder Auftrag sperren
Telemetry|Telemetrie
Telemetry, detection and response|Telemetrie, Erkennung und Reaktion
Tool / model events|Werkzeug- und Modellereignisse
Tool and credential plane|Werkzeuge und Zugangsdaten
Tool and model events|Werkzeug- und Modellereignisse
Topic / time window filter *|Topic- und Zeitfensterfilter *
Trusted provisioning evidence|Vertrauenswürdiger Bereitstellungsbeleg
Unrestricted inference|Uneingeschränkte Modellnutzung
Unverified assignment|Ungeprüfter Auftrag
Validated call / distinct service authorization|Geprüfter Aufruf und getrennte Dienstfreigabe
Validated trigger via mission ingress *|Geprüfter Auslöser über den Auftragseingang *
Vault token and configured credential role|Vault-Token und eingerichtete Zugangsrolle
Verified authority and token context|Geprüfte Befugnis und Token-Kontext
Verified subject / actor context|Geprüftes Subjekt und Akteur
Verified user context|Geprüfter Benutzerkontext
Verified workload identity|Geprüfte Workload-Identität
Versioned report|Bericht mit Fassung
admit|zulassen
broad ACL|weite ACL
child scope|Teilauftrag
create|anlegen
credential grant|Zugang
employee access|Mitarbeiterzugang
facts|Fakten
filtered read|gefiltertes Lesen
findings|Funde
inference|Modellaufruf
launch grant|Startfreigabe
mediated|vermittelt
mediated HTTPS|vermitteltes HTTPS
mission state|Auftragsstatus
model call|Modellaufruf
native role|native Rolle
observed events|beobachtete Ereignisse
owner / status|Verantwortung und Status
private channel|privater Kanal
provider access|Anbieterzugang
resource check|Ressourcenprüfung
reuse|Wiederverwendung
revoke|widerrufen
revoke / retest|widerrufen und prüfen
scan evidence|Scan-Beleg
scope/version|Umfang und Version
storage|Speicher
subject|Subjekt
suspend|sperren
tool args|Werkzeugparameter
tool call|Werkzeugaufruf
unverified task|ungeprüfter Auftrag
upload attempt|Upload-Versuch
verify|prüfen
Admission binding *|Zulassungsbindung *
Approved model|Erlaubtes Modell
Astra DB / storage *|Astra DB und Speicher *
Audit + retest *|Audit und erneute Prüfung *
CRM / finance|CRM und Finanzen
Connector / MCP|Konnektor und MCP
Data / business APIs|Daten und Fach-APIs
Delegation / budget *|Delegation und Budget *
Endpoint / network|Endgerät und Netzwerk
Exact approval *|Konkrete Freigabe *
External destination|Externes Ziel
External model|Externes Modell
Inherited credentials|Übernommene Zugangsdaten
Kafka / payments|Kafka und Zahlungen
MCP / A2A gateway|MCP- und A2A-Gateway
Model / MCP gateway|Modell- und MCP-Gateway
Nova / unmanaged|Nova, unverwaltet
OpenShell supervisors|OpenShell-Supervisoren
Orchestrator *|Orchestrierung *
Public research MCP|MCP für öffentliche Recherche
Resource admins|Ressourcenadministration
SOC / response *|SOC und Reaktion *
Astra DB / CRM|Astra DB und CRM
IBM Verify / Agent ID|IBM Verify und Agent Identity
IBM Verify / issuer|IBM Verify oder Aussteller
Flink correlation|Flink-Korrelation
Confluent security|Confluent-Sicherheitsereignisse
`);
 pairs(`
Stop requested|Stopp angefordert
awaiting confirmation|Bestätigung ausstehend
Stopped and verified|Stopp bestätigt
Mission suspended|Auftrag gesperrt
new issuance blocked|Keine neuen Zugangsdaten
Runtime route status unverified|Status des Laufzeitzugangs nicht bestätigt
Quarantine requested|Quarantäne angefordert
Common causes of rail disruption include equipment faults, severe weather and signal failures.|Häufige Ursachen für Bahnstörungen sind technische Defekte, Unwetter und Signalstörungen.
Inspect the RE-204 door sensor. The event log and earlier incident history support that recommendation.|Den Türsensor von RE-204 prüfen. Das Ereignisprotokoll und frühere Störfälle stützen diese Empfehlung.
Controls unavailable|Kontrollen außer Betrieb
Automated response is off. Request enforcement and logging are evaluated separately.|Die automatische Reaktion ist aus. Zugriffsprüfung und Protokollierung werden separat bewertet.
UNVERIFIED|NICHT BESTÄTIGT
enforcement gap|Lücke bei der Durchsetzung
The remaining controls do not establish a request outcome in this simulation.|Mit den verbleibenden Kontrollen lässt sich in dieser Simulation kein Ergebnis für die Anfrage bestätigen.
The resource enforcement point refuses internal data for this public-only assignment.|Die Zugriffskontrolle am Ziel verweigert interne Daten für diese rein öffentliche Recherche.
resource read denied|Lesezugriff an der Ressource verweigert
Family access app|Familien-App für Freigaben
The family access app is still available.|Die Familien-App für Freigaben ist weiterhin verfügbar.
Ask my parents for more time|Meine Eltern um mehr Zeit bitten
Ask Dad for a read-only pass in the family app|Papa in der Familien-App um Lesezugriff bitten
Dad approves a 30-minute pass for the conductor notes. The laptop will check the pass when Alex opens the folder. Family finances stays locked.|Papa gibt die Zugbegleiter-Notizen für 30 Minuten zum Lesen frei. Der Laptop prüft die Freigabe, sobald Alex den Ordner öffnet. Die Familienfinanzen bleiben gesperrt.
The parents approve another short Wikipedia window for this assignment. The family app still works while homework access is paused. The laptop stays locked.|Die Eltern geben Wikipedia für diese Aufgabe noch einmal kurz frei. Die Familien-App funktioniert auch während der Hausaufgabenpause. Der Laptop bleibt gesperrt.
Both folders are on the same laptop. Choose a folder to see what Alex’s pass lets him open.|Beide Ordner liegen auf demselben Laptop. Wähle einen Ordner aus und prüfe, was Alex mit seiner Freigabe öffnen kann.
Open {{1}} in {{2}}|„{{1}}“ öffnen · {{2}}
Connected service|Verbundener Dienst
Handled by {{1}}|Bearbeitet von {{1}}
Compare two ticket previews|Zwei Ticketvorschauen vergleichen
Same tool, priority and destination. The only change is the train. A preview creates no ticket.|Werkzeug, Priorität und Ziel bleiben gleich. Nur der Zug ändert sich. Bei der Vorschau entsteht kein Ticket.
Preview {{1}}|Vorschau für {{1}}
The maintenance system permits the request for this train. Only a separate commit creates the ticket.|Das Wartungssystem erlaubt die Anfrage für diesen Zug. Das Ticket entsteht erst bei einer gesonderten Ausführung.
The maintenance system refuses this train because it is outside the mission. No ticket was created.|Das Wartungssystem lehnt die Anfrage ab, weil dieser Zug nicht zum Auftrag gehört. Es wurde kein Ticket angelegt.
Try this at work|Im eigenen Unternehmen testen
Expected result|Erwartetes Ergebnis
Evidence to keep|Diese Nachweise aufbewahren
Can an old sign-in still open private data?|Kann eine alte Anmeldung noch auf private Daten zugreifen?
Use a test account and a sample private record. Leave a test device signed in, then have the account owner end the session and check the same device again.|Nutze ein Testkonto mit einem vertraulichen Beispieldatensatz. Lass ein Testgerät angemeldet, beende die Sitzung über das Konto und prüfe dasselbe Gerät erneut.
The old session asks for a fresh sign-in. The team checks separately whether anything was already copied or shared.|Das Gerät verlangt eine neue Anmeldung. Das Team prüft separat, ob Daten bereits kopiert oder weitergegeben wurden.
Session closure record, the result of the old-session check, and a list of the destinations reviewed.|Protokoll der Sitzungsbeendigung, Ergebnis der Prüfung der alten Sitzung und Liste der geprüften Ziele.
Does the assistant get only the app it needs?|Hat der Assistent nur Zugriff auf die benötigte App?
Give a test user one approved app for a short window. Open that app and a second app, then try the approved app again after the window expires.|Gib einem Testnutzer eine App für kurze Zeit frei. Öffne diese und eine zweite App. Versuche nach Ablauf der Zeit erneut, die freigegebene App zu öffnen.
The approved app opens during the window. The other app stays locked, and the approved app closes when time is up.|Die freigegebene App öffnet sich innerhalb des Zeitfensters. Die andere App bleibt gesperrt. Nach Ablauf der Zeit endet der Zugriff auf die freigegebene App.
The time-limited approval, one allowed and one blocked attempt, and the expiry check.|Befristete Freigabe, je ein erlaubter und gesperrter Zugriff sowie die Prüfung nach Ablauf.
Does a folder pass stay read-only?|Erlaubt die Ordnerfreigabe wirklich nur Lesen?
Give a test user read access to one folder. On the same device, try reading that folder, editing one of its files, and opening an unrelated folder.|Gib einem Testnutzer Lesezugriff auf einen Ordner. Versuche auf demselben Gerät, den Ordner zu lesen, eine Datei darin zu bearbeiten und einen anderen Ordner zu öffnen.
The approved read works. Both the edit and the unrelated read are refused.|Der genehmigte Lesezugriff funktioniert. Die Änderung und der Zugriff auf den anderen Ordner werden verweigert.
The approved folder and operation, plus the three outcomes from the file service.|Freigegebener Ordner, erlaubte Aktion und alle drei Ergebnisse des Dateidienstes.
Does an edited copy need fresh approval?|Braucht eine bearbeitete Fassung eine neue Freigabe?
Approve a test document for one person. Change a harmless sentence, then try to send the edited copy using the old approval.|Gib ein Testdokument für eine Person frei. Ändere einen unbedenklichen Satz und versuche, die bearbeitete Fassung mit der alten Freigabe zu senden.
The delivery service holds the revised copy. Sending it requires a fresh decision for that copy and recipient.|Der Versanddienst hält die bearbeitete Fassung zurück. Für den Versand ist eine neue Freigabe für diese Fassung und den Empfänger nötig.
The approved revision, the edited revision and the refusal from the delivery service.|Freigegebene Fassung, bearbeitete Fassung und Ablehnung durch den Versanddienst.
Can you prove the old access ended?|Kannst du nachweisen, dass der alte Zugriff beendet wurde?
In a test environment, inventory the identity and the resources it reached. Revoke the test identity’s access and repeat a previously allowed request using the old session.|Erfasse in einer Testumgebung die Identität und die von ihr erreichten Ressourcen. Entziehe der Testidentität den Zugriff und wiederhole mit der alten Sitzung eine zuvor erlaubte Anfrage.
The resource refuses the old session. The team checks completed exports separately and records any routes it could not verify.|Die Ressource weist die alte Sitzung ab. Das Team prüft abgeschlossene Exporte separat und erfasst alle Zugriffswege, die es nicht verifizieren konnte.
Asset and identity inventory, revocation time, resource refusal, and checked destinations.|Bestandsliste der Systeme und Identitäten, Zeitpunkt des Widerrufs, Ablehnung an der Ressource und geprüfte Ziele.
Does a changed runtime receive a credential?|Erhält eine veränderte Laufzeit Zugangsdaten?
In a test deployment, register two sandbox instances for the same agent. Give one instance the approved posture and give the other a mismatching test posture. Request the same scoped credential through the broker.|Registriere in einer Testumgebung zwei Sandbox-Instanzen für denselben Agenten. Eine erfüllt die Sicherheitsvorgaben, die andere weist gezielt eine Abweichung auf. Fordere über den Broker für beide dieselben eingeschränkten Zugangsdaten an.
Only the approved instance passes admission and becomes eligible for credential issuance. The broker still checks its own policy.|Nur die Instanz mit dem genehmigten Sicherheitszustand besteht die Zulassungsprüfung und kommt für die Ausgabe infrage. Der Broker prüft weiterhin seine eigene Richtlinie.
Distinct instance IDs, the admission results, and issuance or denial events from the credential broker.|Unterschiedliche Instanz-IDs, Ergebnisse der Zulassung sowie Ausgabe- oder Ablehnungsereignisse des Brokers.
Does closing one mission leave the other working?|Bleibt der zweite Auftrag nach Abschluss des ersten nutzbar?
Open two synthetic missions for one agent. Close M-204, retry its old incident-history read, then read the separate RE-105 document under M-105.|Starte zwei simulierte Aufträge für einen Agenten. Schließe M-204, wiederhole dessen bisherigen Lesezugriff auf die Störfallhistorie und lies anschließend das separate RE-105-Dokument im Auftrag M-105.
The old read is denied. The M-105 read still works and its receipt names M-105 and RE-105.|Der alte Lesezugriff wird verweigert. Der Zugriff über M-105 funktioniert weiterhin. Der Nachweis nennt M-105 und RE-105.
Both resource receipts with mission ID, version, operation, resource and decision.|Beide Zugriffsnachweise mit Auftrags-ID, Version, Aktion, Ressource und Entscheidung.
Does the resource recheck authority before commit?|Prüft die Ressource die Berechtigung direkt vor der Ausführung erneut?
Preview a synthetic maintenance ticket. Revoke the test mission while the preview is pending, then try to commit the same ticket.|Erstelle die Vorschau eines simulierten Wartungstickets. Widerrufe den Testauftrag während der Vorschau und versuche danach, genau dieses Ticket anzulegen.
The maintenance API refuses the commit. The ticket store shows zero new tickets for that operation ID.|Die Wartungs-API verweigert die Ausführung. Für diese Vorgangs-ID ist kein neues Ticket gespeichert.
The preview, revocation and commit decisions in time order, plus the ticket lookup for the operation ID.|Vorschau, Widerruf und Ausführungsentscheidung in zeitlicher Reihenfolge sowie die Ticketsuche für die Vorgangs-ID.
`);
 return Object.freeze(translations);
})();
