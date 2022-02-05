import express from 'express';
import bodyParser from 'body-parser';
import routes from 'routes';
import { runJobs } from 'services/jobs';
import figlet from 'figlet';
import gradient from 'gradient-string';

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());
//headers
app.use((_req: any, res: any, next: () => void) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use((req: any, _res: any, next: () => void) => {
  console.log('Requeset Body: ', req.body);
  console.log('Requeset Headers: ', req.headers);
  next();
});

app.use('/api/', routes);

app.listen(process.env.PORT as unknown as number || 7550 ,() => {
  runJobs();
  console.log(gradient.pastel.multiline(figlet.textSync('Pepper')));
  console.log(`Https server running on port ${process.env.PORT as string || 7550}`);
});

export default app;