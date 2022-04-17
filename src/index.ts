import express from 'express';
import bodyParser from 'body-parser';
import routes from 'routes';
import { runJobs } from 'services/jobs';
import figlet from 'figlet';
import gradient from 'gradient-string';
import EnvHelper from 'helpers/envHelper';
import { setupReactViews } from 'express-tsx-views';
import path, { resolve } from "path";
import { Organizer } from 'orms';

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  limit: '10mb', // max file size
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

// TODO: put this in a helper
app.use((req: any, _res: any, next: () => void) => {
  console.log('Requeset Body: ', req.body);
  console.log('Requeset Method: ', req.method);
  console.log('Requeset Url: ', req.originalUrl);
  console.log('Requeset Headers: ', req.headers);
  next();
});

app.use(express.static(path.join(__dirname, 'views')));

setupReactViews(app, {
  viewsDirectory: resolve(__dirname, 'views'),
});

app.get("/admin", async(_req, res) => {
  const organizers = await Organizer.findAll({ raw: true });
  res.render("admin", { organizers });
});


app.use('/api/', routes);
app.get('/health-check/', (_req: any, res: any) => res.json({ message: 'up'}));
if (!EnvHelper.isTest()) {
  app.listen(process.env.PORT as unknown as number || 7550 ,() => {
    runJobs();
    console.log(gradient.pastel.multiline(figlet.textSync('Pepper')));
    console.log(`Https server running on port ${process.env.PORT as string || 7550}`);
  });
}

export default app;