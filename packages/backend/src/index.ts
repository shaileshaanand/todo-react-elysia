import app from "./app";
import env from "./utils/env";

app.listen(env.PORT ?? 3000);
