import { defaultJobMachine } from '../../../utils/constants';
import { DEPENDENCIES } from '../../../utils/dependencies';

export = {
  name: 'dummy',
  // To disable a workflow simply uncomment the below
  // disable: true,
  on: 'fork',
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SHOULD_RUN: 'false',
  },
  jobs: {
    dummy: {
      ...defaultJobMachine,
      steps: Object.keys(DEPENDENCIES).map(key => {
        return {
          if: `env.SHOULD_RUN == 'true'`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          uses: (DEPENDENCIES as any)[key],
        };
      }),
    },
  },
};
