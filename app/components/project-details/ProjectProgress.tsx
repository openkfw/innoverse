'use client';
import { useState } from 'react';
import Image from 'next/image';
import MuiMarkdown, { Overrides } from 'mui-markdown';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, Divider, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

import { AuthorInformation } from './AuthorInformation';

import robotic_hand from '/public/images/robotic-hand.png';

const InfoItemRight = () => {
  return (
    <Card
      sx={{
        width: 270,
        height: 370,
        backgroundColor: '#EBF3F7',
        borderRadius: 'var(--1, 8px)',
      }}
    >
      <CardContent>
        <MuiMarkdown
          overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}
        >{`##Blockchain`}</MuiMarkdown>
      </CardContent>
      <CardMedia>
        <Image src={robotic_hand} alt="image" height={140} style={{ marginLeft: '4%' }} />
      </CardMedia>
      <CardContent>
        <MuiMarkdown overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}>
          {` Die Blockchain-Technologie stellt sicher, dass keine Manipulation möglich ist.`}
        </MuiMarkdown>
      </CardContent>
    </Card>
  );
};

export const ProjectProgress = () => {
  const [contentSize, setContentSize] = useState<string>('600px');
  const [showMoreButtonVisible, setShowMoreButtonVisible] = useState<boolean>(true);
  const showMoreButtonStyle = {
    background: 'linear-gradient(to bottom, rgba(255,0,0,0), rgba(255,255,255,1))',
    position: 'absolute',
    bottom: '20%',
    paddingTop: '150px',
    textAlign: 'center',
    width: '100%',
    borderRadius: '4px',
    ml: '-32px', //removes default ml from container
  };

  const expand = () => {
    setContentSize('100%');
    setShowMoreButtonVisible(false);
  };

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: '24px',
      }}
    >
      <Stack
        sx={{
          margin: 4,
        }}
      >
        <Box
          sx={{
            height: contentSize,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              ...showMoreButtonStyle,
              visibility: showMoreButtonVisible ? 'visible' : 'hidden',
            }}
          >
            <IconButton aria-label="delete" sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={expand}>
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={0} justifyContent={'space-between'}>
            <Box
              sx={{
                m: 5,
              }}
            >
              <MuiMarkdown overrides={{ style: { color: 'text.primary' } } as unknown as Overrides}>
                {`# TruBudget

### Worum geht es: Eine verteilte Workflow-Engine für die EZ
### Inspirierend: Verwendung von Blockchain Technologie, um Daten sicher und zuverlässig verteilt zu speichern

### Um was geht es?
Problembeschreibung
Aktuell bestehende Herausforderungen in der Finanzierung von Infrastrukturvorhaben in den Partnerländern der FZ.

Ein Haupthindernis in der Förderung von armutsrelevantem Wirtschaftswachstum in Entwicklungsländern sind die äußert schwachen Umsetzungskapazitäten des öffentlichen Sektors in Bezug auf die erforderliche wirtschaftliche und soziale Infrastruktur. Dies betrifft zum einen die unzureichende Finanzausstattung der Investitionshaushalte, aber auch die ineffiziente Umsetzung der begrenzten Mittel einschließlich der damit verbundenen Korruptionsrisiken. So stoßen auch externe Zuwendungen von Gebern schnell an die Grenzen der geringen Absorptionsfähigkeit vieler Entwicklungsländer. Voraussetzung eines nachhaltigen Wirtschaftswachstums in diesen Ländern ist daher nicht nur eine Verbreiterung der Einkommensbasis, sondern vor allem die Sicherstellung eines effizienten Mitteleinsatzes. Das Potenzial eines verbesserten Mitteleinsatzes in Entwicklungsländern ist vermutlich gewaltig.

Zur Absicherung einer transparenten Verwendung ihrer Mittel vergeben Geberländer ihre Zuschüsse in der Regel zweckgebunden an vordefinierte Projekte und vereinbaren individuelle Bedingungen und Arbeitsprozesse mit dem Empfängerland je nach ihren eigenen politischen und regulativen Vorgaben.

Dieses Vorgehen hat jedoch schwerwiegende Nachteile:

1. Die Kapazitäten des Partnerlandes werden durch die Vielzahl sehr unterschiedlicher Finanzierungsmodelle und Umsetzungsmodalitäten der Geber weiter geschwächt.
Die weitere Schwächung der Umsetzungskapazitäten führt aufgrund der steigenden Risiken zu einer weiteren Intensivierung der Kontrollbedürfnisse der Geber. Dadurch entstehen oftmals aufwendige Parallelstrukturen.
In dieser sich gegenseitig verstärkenden Wechselwirkung steigen die Transaktionskosten für alle Beteiligten.
Eine Projektfinanzierung außerhalb der üblichen Budgetprozesse bietet keinen Anreiz, die eigenen Haushaltsmittel analog der Gebermittel umzusetzen.
Entscheidender ist aber der Aspekt, dass durch die Nichtberücksichtigung des Haushaltes des Partnerlandes bei der Geberfinanzierung letztlich keine nachhaltige strukturelle Wirkung erzielt werden kann und damit die Wirkung auf Projektebene zeitlich und räumlich sehr begrenzt bleibt.
Im Zuge der Paris Declaration on Aid Effectiveness 2005 wurde diese Problematik aufgegriffen und Maßnahmen zur Harmonisierung der Geberunterstützung und ihrer Integration in Partnersysteme vereinbart. Daraus resultierten u.a. umfangreiche Joint Donor Strategies und die Fokussierung der Mittel auf sog. Programmorientierte Gemeinschaftsfinanzierungen (Budgethilfe).

1. Diese Ansätze der Budgethilfe gelten mittlerweile als gescheitert. Letztlich konnten zwar strukturelle Verbesserungen in einer Vielzahl von Prozessen des Public Financial Management erreicht werden, dies war jedoch nicht ausreichend, um die Umsetzung konkreter Investitionsvorhaben (z.B. Bau von Grundschulen) über Mittelallokationen aus dem öffentlichen Haushaltes eines Partnerlandes nachhaltig sicherzustellen. Auch aufgrund dieser negativen Erfahrung konzentrieren sich Geber in den letzten Jahren wieder zunehmend auf projektbezogene Finanzierungen. Darüber hinaus ist mit einer unüberschaubaren Vielzahl neuer thematischer und regionaler Fonds die Anzahl der Finanzierungspartner und -instrumente stark angestiegen, was die o.g. negativen Effekte der Projektfinanzierung weiter verstärkt.

## Lösungsidee: Erhöhte Transparenz und Manipulationssicherheit zur effizienten Nutzung von Finanzmitteln in den öffentlichen Haushalten
Viele Partnerländer setzen zur Planung und Umsetzung öffentlicher Finanzmitteln ein Integrated Financial Management Information System (IFMIS) ein, welches die relevanten Daten und Workflows verarbeitet. Diese Systeme haben allerdings Nachteile:

Sie sind in dem jeweiligen Land oder Institution zentralisiert und damit anfällig für Manipulation. In dem „Cashgate“ Skandal in Malawi in 2014 wurden umgerechnet 32 Millionen USD veruntreut, indem das lokale IFMIS System manipuliert wurde.
Durch fehlende Nutzerfreundlichkeit und Flexibilität werden die Systeme unvollständig gepflegt, worunter die Datenqualität leidet. Mit Hilfe eines verteilten Systems wie TruBudget können die Daten von den Teilnehmern auf einer gemeinsamen, nutzerfreundlichen Plattform gepflegt und überprüft werden. Die Blockchain-Technologie stellt sicher, dass keine Manipulation möglich ist.
Mit TruBudget können Budget-Linien, Projekte und Sub-Projekte fallbezogen definiert werden. Diesen sind Genehmigungsprozesse zugeordnet, die typische Abläufe im Public Financial Management abbilden, z.B. Ausschreibungen, Vertragsgestaltung von Lieferung und Leistungen sowie Auszahlungsmanagement. Die gesamte TruBudget Datenbasis wird in einer privaten Blockchain gespeichert, welche auf alle Teilnehmer verteilt ist. Dies schafft Transparenz und verhindert eine einseitige Manipulation des Datenbestands.

## Zusammenfassung: Eigenschaften und Vorteile von TruBudget auf einen Blick
TruBudget erreicht mit Hilfe der Blockchain-Technologie folgende Eigenschaften:

### Eine manipulationssichere Datenbank („Ledger“) basierend auf der Blockchain-Technologie
Verteilung der gesamten Information in Echtzeit an alle Teilnehmer
Zuweisung spezifischer Zugriffsrechte basierend auf Rollen
Informationen über den aktuellen Status von Projekten sind für alle Teilnehmer jederzeit und in Echtzeit sichtbar
Verantwortlichkeiten, Aktivitäten und Budgetnutzung sind jederzeit nachvollziehbar (permanenter Audit)
Daraus ergeben sich folgende Vorteile gegenüber bestehenden Lösungen:

- Höhere Effizienz im Einsatz von öffentlichen Geldern
- Reduziertes Risiko der Veruntreuung für Geldgeber
- Bestehende Systeme des Partnerlandes können von den Gebern verwendet werden, anstatt Parallelstrukturen aufzubauen
- Reduzierte Transaktionskosten für Länder und Geldgeber
- Public Financial Management (PFM) ist mit TruBudget für zukünftige Entwicklungen wie digitale Finanzwesen und digitale Währungen gerüstet

### Warum ist es inspirierend?
- Eine Blockchain ist eine Technologie für Datenverarbeitung, deren Stärken die Verteilung der Daten, die Sicherheit der Daten und die Transparenz von Daten ist. Im Fall der Entwicklungszusammenarbeit sind diese Eigenschaften fachlich sinnvoll.
- TruBudget wurde als Open Source Software und als Digital Public Good klassifiziert. Damit ist es eins der ersten digitalen Förderinstrumente ***STRING_REMOVED*** .`}
              </MuiMarkdown>
            </Box>
            <Box
              sx={{
                ml: '5%',
                mt: '25%',
              }}
            >
              <InfoItemRight />
            </Box>
          </Stack>
        </Box>

        <Divider />
        <AuthorInformation />
        <Divider />
      </Stack>
    </Card>
  );
};
