import { createClient } from "@libsql/client";

import { createBetterAuthServer } from "../shared/auth/server";
import { createDrizzleSQLite } from "../shared/db/client";
import { localOrigin } from "../shared/url";

// Used by the generate:auth task without connecting to a persistent database.
export default createBetterAuthServer(createDrizzleSQLite(createClient({ url: ":memory:" })), {
  baseURL: localOrigin,
});
