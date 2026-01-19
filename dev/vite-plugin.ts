import type { EnvironmentOptions, Plugin } from "vite";

import { x } from "tinyexec";

import { localhost, localPort } from "../shared/url";

export const configureLocalNetwork = (): Plugin => {
  return {
    config: () => ({
      preview: {
        host: localhost,
        port: localPort,
      },
      server: {
        host: localhost,
        port: localPort,
      },
    }),
    name: "project:configure-local-network",
  };
};

type SourcemapOptions = NonNullable<EnvironmentOptions["build"]>["sourcemap"];

type ConfigureSourcemapPerEnvironmentOptions = Record<
  string,
  {
    /**
     * Sourcemap config during `vite build`.
     *
     * @see {@link https://vite.dev/config/build-options#build-sourcemap}
     */
    build?: SourcemapOptions;
    /**
     * Sourcemap config during `vite dev`.
     *
     * @see {@link https://vite.dev/config/build-options#build-sourcemap}
     */
    serve?: SourcemapOptions;
  }
>;

export const configureSourcemapPerEnvironment = (
  options: ConfigureSourcemapPerEnvironmentOptions,
): Plugin[] => {
  const pluginBase = (
    targetEnv: string,
    value: ConfigureSourcemapPerEnvironmentOptions[string],
  ): Plugin[] => {
    return [
      {
        apply: "serve",
        configEnvironment(name) {
          if (name === targetEnv) {
            return {
              build: {
                sourcemap: value.serve,
              },
            };
          }
          return null;
        },
        enforce: "post",
        name: `configure-serve-sourcemap-for-environment-${targetEnv}`,
      },
      {
        apply: "build",
        configEnvironment(name) {
          if (name === targetEnv) {
            return {
              build: {
                sourcemap: value.build,
              },
            };
          }
          return null;
        },
        enforce: "post",
        name: `configure-build-sourcemap-for-environment-${targetEnv}`,
      },
    ];
  };

  return Object.entries(options).flatMap(([targetEnv, value]) => {
    return pluginBase(targetEnv, value);
  });
};

async function migrate(): Promise<void> {
  await x("pnpm", ["run", "db:migrate"], {
    throwOnError: true,
  });
}

export const migrateD1AfterWorkerdStart = (targetEnv: string): Plugin => {
  return {
    apply: "serve",
    applyToEnvironment: (env) => env.name === targetEnv,
    configureServer() {
      void migrate().catch((err) => {
        console.error("Failed to migrate D1 database:", err);
      });
    },
    enforce: "post",
    name: "project:migrate-d1-after-workerd-start",
  };
};
