import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CustomButton from '@/components/common/CustomButton';

import PhaseColumn from './PhaseColumn';

const mappingData = [
  {
    title: 'Exploration',
    description:
      'Explorationsprojekte beschäftigen sich in erster Linie damit, ein Thema zu erforschen und zu untersuchen, um ein tieferes Verständnis zu erlangen. Dies kann wissenschaftliche Forschung, Marktforschung oder jede andere Form der Untersuchung einschließen.',
    projects: ['Transforming Banking for the Digital Age', 'Building the Bank of Future'],
  },
  {
    title: 'Konzeption',
    description:
      'In der Konzeptionsphase werden die Ziele und Ergebnisse des Projekts genau definiert. Dies sollte klar und präzise sein, damit alle Teammitglieder verstehen, was erreicht werden soll. Sie beinhaltet auch die Identifizierung von Risiken, die das Projekt beeinflussen könnten,',
    projects: ['AI in Financial Technology'],
  },
  {
    title: 'Proof of Concept',
    description:
      'Ein PoC dient der Validierung einer Idee oder eines Konzepts. Es soll zeigen, dass das Konzept in der Praxis umsetzbar ist und die gewünschten Ergebnisse liefern kann. So können potenzielle Risiken und Herausforderungen frühzeitig erkannt und angegangen werden. ',
    projects: [
      'DataBank: Leveraging Big Data for Insights',
      'Strengthening Online Banking Security',
      'Enhancing Personal Finance Management',
    ],
  },
];

export const MappingProjectsCard = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={10} sx={{ mb: 10 }}>
        <Card
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: `blur(20px)`,
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            height: '600px',
            boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
          }}
        >
          <CardHeader
            sx={{ textAlign: 'left', mt: '30px', ml: '25px', mr: '25px' }}
            title={<Typography variant="h4">Mapping projects</Typography>}
            action={<CustomButton>Backstage</CustomButton>}
          />
          <CardContent sx={{ ml: '25px', mr: '25px' }}>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {mappingData.map((data) => {
                return (
                  <PhaseColumn
                    key={data.title}
                    title={data.title}
                    description={data.description}
                    projects={data.projects}
                  ></PhaseColumn>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
